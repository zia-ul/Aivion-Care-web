import { authApi, appointmentApi, doctorApi, consultationApi, hospitalApi, superAdminApi, notificationApi, patientApi, aiApi, billingApi, chatApi } from '@/lib/api/endpoints';

describe('API Endpoints', () => {
  describe('authApi', () => {
    it('should have login method', () => {
      expect(typeof authApi.login).toBe('function');
    });

    it('should have refreshToken method', () => {
      expect(typeof authApi.refreshToken).toBe('function');
    });

    it('should have logout method', () => {
      expect(typeof authApi.logout).toBe('function');
    });

    it('should have registerPatient method', () => {
      expect(typeof authApi.registerPatient).toBe('function');
    });

    it('should have registerDoctor method', () => {
      expect(typeof authApi.registerDoctor).toBe('function');
    });

    it('should have registerHospital method', () => {
      expect(typeof authApi.registerHospital).toBe('function');
    });

    it('should have getHospitals method', () => {
      expect(typeof authApi.getHospitals).toBe('function');
    });
  });

  describe('appointmentApi', () => {
    it('should have getMyAppointments method', () => {
      expect(typeof appointmentApi.getMyAppointments).toBe('function');
    });

    it('should have selfBook method', () => {
      expect(typeof appointmentApi.selfBook).toBe('function');
    });

    it('should have updateStatus method', () => {
      expect(typeof appointmentApi.updateStatus).toBe('function');
    });

    it('should have getInvoice method', () => {
      expect(typeof appointmentApi.getInvoice).toBe('function');
    });
  });

  describe('doctorApi', () => {
    it('should have getMyProfile method', () => {
      expect(typeof doctorApi.getMyProfile).toBe('function');
    });

    it('should have updateMyProfile method', () => {
      expect(typeof doctorApi.updateMyProfile).toBe('function');
    });

    it('should have getDashboardStats method', () => {
      expect(typeof doctorApi.getDashboardStats).toBe('function');
    });

    it('should have getAppointments method', () => {
      expect(typeof doctorApi.getAppointments).toBe('function');
    });

    it('should have getAvailability method', () => {
      expect(typeof doctorApi.getAvailability).toBe('function');
    });

    it('should have createAvailability method', () => {
      expect(typeof doctorApi.createAvailability).toBe('function');
    });

    it('should have updateAvailability method', () => {
      expect(typeof doctorApi.updateAvailability).toBe('function');
    });

    it('should have deleteAvailability method', () => {
      expect(typeof doctorApi.deleteAvailability).toBe('function');
    });

    it('should have getSlots method', () => {
      expect(typeof doctorApi.getSlots).toBe('function');
    });

    it('should have getMyPatients method', () => {
      expect(typeof doctorApi.getMyPatients).toBe('function');
    });
  });

  describe('consultationApi', () => {
    it('should have getByAppointment method', () => {
      expect(typeof consultationApi.getByAppointment).toBe('function');
    });

    it('should have get method', () => {
      expect(typeof consultationApi.get).toBe('function');
    });

    it('should have update method', () => {
      expect(typeof consultationApi.update).toBe('function');
    });

    it('should have addVitals method', () => {
      expect(typeof consultationApi.addVitals).toBe('function');
    });

    it('should have finalizePrescription method', () => {
      expect(typeof consultationApi.finalizePrescription).toBe('function');
    });

    it('should have sendPrescription method', () => {
      expect(typeof consultationApi.sendPrescription).toBe('function');
    });

    it('should have getPrescriptionPdf method', () => {
      expect(typeof consultationApi.getPrescriptionPdf).toBe('function');
    });

    it('should have uploadRecordingAndGenerateDraft method', () => {
      expect(typeof consultationApi.uploadRecordingAndGenerateDraft).toBe('function');
    });

    it('should have generateAiNotes method', () => {
      expect(typeof consultationApi.generateAiNotes).toBe('function');
    });

    it('should have getRecords method', () => {
      expect(typeof consultationApi.getRecords).toBe('function');
    });
  });

  describe('hospitalApi', () => {
    it('should have getAll method', () => {
      expect(typeof hospitalApi.getAll).toBe('function');
    });

    it('should have get method', () => {
      expect(typeof hospitalApi.get).toBe('function');
    });
  });

  describe('superAdminApi', () => {
    it('should have getHospitals method', () => {
      expect(typeof superAdminApi.getHospitals).toBe('function');
    });

    it('should have updateHospitalStatus method', () => {
      expect(typeof superAdminApi.updateHospitalStatus).toBe('function');
    });

    it('should have getDoctorVerifications method', () => {
      expect(typeof superAdminApi.getDoctorVerifications).toBe('function');
    });

    it('should have updateDoctorVerification method', () => {
      expect(typeof superAdminApi.updateDoctorVerification).toBe('function');
    });

    it('should have broadcastNotification method', () => {
      expect(typeof superAdminApi.broadcastNotification).toBe('function');
    });

    it('should have getAnalytics method', () => {
      expect(typeof superAdminApi.getAnalytics).toBe('function');
    });

    it('should have generateLoginId method', () => {
      expect(typeof superAdminApi.generateLoginId).toBe('function');
    });
  });

  describe('notificationApi', () => {
    it('should have getMy method', () => {
      expect(typeof notificationApi.getMy).toBe('function');
    });

    it('should have getUnreadCount method', () => {
      expect(typeof notificationApi.getUnreadCount).toBe('function');
    });

    it('should have markRead method', () => {
      expect(typeof notificationApi.markRead).toBe('function');
    });
  });

  describe('patientApi', () => {
    it('should have getVitals method', () => {
      expect(typeof patientApi.getVitals).toBe('function');
    });

    it('should have getMedicationReminders method', () => {
      expect(typeof patientApi.getMedicationReminders).toBe('function');
    });

    it('should have startMedicationReminder method', () => {
      expect(typeof patientApi.startMedicationReminder).toBe('function');
    });

    it('should have logAdherence method', () => {
      expect(typeof patientApi.logAdherence).toBe('function');
    });
  });

  describe('aiApi', () => {
    it('should have patientChat method', () => {
      expect(typeof aiApi.patientChat).toBe('function');
    });
  });

  describe('billingApi', () => {
    it('should have getInvoice method', () => {
      expect(typeof billingApi.getInvoice).toBe('function');
    });

    it('should have getInvoicePdf method', () => {
      expect(typeof billingApi.getInvoicePdf).toBe('function');
    });
  });
});
