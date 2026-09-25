# Backend Changes Required for Web Platform

## 1. CORS Restriction (Security)

**File:** `backend/src/main/java/com/medicore/config/SecurityConfig.java`

**Current code (line 76):**
```java
configuration.setAllowedOrigins(List.of("*"));
```

**Change to:**
```java
@Value("${ALLOWED_ORIGINS:*}")
private List<String> allowedOrigins;

// In corsConfigurationSource():
configuration.setAllowedOrigins(allowedOrigins);
```

**Add to `backend/.env`:**
```env
ALLOWED_ORIGINS=http://localhost:3000,https://your-web-domain.com,https://www.your-web-domain.com
```

## 2. WebSocket Notification Push

**File:** `backend/src/main/java/com/medicore/service/NotificationDispatchService.java`

After persisting notification in `dispatch()` method, add:
```java
messagingTemplate.convertAndSendToUser(
    recipient.getId().toString(),
    "/queue/notifications",
    NotificationWsDto.from(saved)
);
```

**New DTO:** `NotificationWsDto.java`
```java
public record NotificationWsDto(Long id, String title, String message, String type, String actionUrl, LocalDateTime sentAt) {
    public static NotificationWsDto from(Notification n) {
        return new NotificationWsDto(n.getId(), n.getTitle(), n.getMessage(), n.getType().name(), n.getActionUrl(), n.getSentAt());
    }
}
```

## 3. WebRTC Signaling

**File:** `backend/src/main/java/com/medicore/controller/ChatSocketController.java`

Add new endpoint:
```java
@MessageMapping("/webrtc/{consultationId}")
public void relayWebRtcSignal(@DestinationVariable Long consultationId, WebRtcSignalRequest request) {
    // Validate consultation exists and sender is participant
    messagingTemplate.convertAndSend("/topic/webrtc/" + consultationId, request);
}
```

**New DTO:** `WebRtcSignalRequest.java`
```java
public record WebRtcSignalRequest(
    String type,
    Long senderId,
    String senderRole,
    Long consultationId,
    Map<String, Object> data
) {}
```

## 4. No Database Changes Required

All required tables and endpoints already exist. The web frontend reuses the existing REST API.

## 5. Deployment Notes

- Update `ALLOWED_ORIGINS` on Render to include the deployed web domain
- Deploy backend changes to Render (triggers rebuild)
- Frontend connects to existing backend URL
