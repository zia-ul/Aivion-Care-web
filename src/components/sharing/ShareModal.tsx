'use client';

import { useState } from 'react';
import { Modal } from '@/components/ui/FlutterTheme';
import { Button } from '@/components/ui';
import {
  shareToWhatsApp, shareNative, copyToClipboard, shareToEmail,
} from '@/lib/sharing';
import {
  Share2, Copy, Mail, Pill, TestTube, Check, ExternalLink,
  MessageCircle, FileText, Phone,
} from 'lucide-react';
import toast from 'react-hot-toast';

export interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  itemTitle: string;
  description?: string;
  shareUrl?: string;
  category?: string;
  phone?: string;
  onSendToPharmacy?: () => void;
  onSendToPathology?: () => void;
}

export function ShareModal({
  isOpen,
  onClose,
  title,
  itemTitle,
  description,
  shareUrl,
  category,
  phone,
  onSendToPharmacy,
  onSendToPathology,
}: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const fullShareText = [
    `*${itemTitle}*`,
    category ? `Type: ${category}` : '',
    description || '',
    'Shared via Aivion Care Health Platform',
  ].filter(Boolean).join('\n');

  const handleCopy = async () => {
    const textToCopy = shareUrl ? `${itemTitle}\n${shareUrl}` : fullShareText;
    const ok = await copyToClipboard(textToCopy, 'Link and details copied!');
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    shareToWhatsApp({
      title: itemTitle,
      text: description || (category ? `Category: ${category}` : 'Medical document via Aivion Care'),
      url: shareUrl,
      phone,
    });
  };

  const handleNativeShare = async () => {
    await shareNative({
      title: itemTitle,
      text: description || fullShareText,
      url: shareUrl,
    });
  };

  const handleEmail = () => {
    shareToEmail({
      subject: `Aivion Care: ${itemTitle}`,
      body: `${fullShareText}\n\n${shareUrl ? `Access Link: ${shareUrl}` : ''}`,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="space-y-5">
        {/* Item Preview Card */}
        <div className="p-4 rounded-2xl bg-surface-10/70 border border-tonal-20/50 space-y-1.5">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-accent flex-shrink-0" />
            <h4 className="font-semibold text-primary-light text-sm truncate">{itemTitle}</h4>
          </div>
          {category && (
            <span className="inline-block px-2 py-0.5 rounded-full text-[11px] font-medium bg-accent/15 text-accent">
              {category}
            </span>
          )}
          {description && (
            <p className="text-xs text-primary-light/60 line-clamp-2">{description}</p>
          )}
          {shareUrl && (
            <p className="text-[11px] text-primary-light/40 font-mono truncate pt-1">
              {shareUrl}
            </p>
          )}
        </div>

        {/* Primary Share Options */}
        <div className="space-y-2.5">
          <p className="text-xs font-semibold text-primary-light/50 uppercase tracking-wider">
            Share to Apps
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {/* WhatsApp Direct */}
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-3 p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500 text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <MessageCircle size={20} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary-light">WhatsApp</p>
                <p className="text-xs text-primary-light/60">Share message or link</p>
              </div>
            </button>

            {/* Native Device Share Sheet */}
            <button
              onClick={handleNativeShare}
              className="flex items-center gap-3 p-3 rounded-xl bg-accent/10 border border-accent/25 text-accent hover:bg-accent/20 transition-all text-left group"
            >
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center flex-shrink-0 shadow-sm group-hover:scale-105 transition-transform">
                <Share2 size={18} />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-bold text-primary-light">Other Apps</p>
                <p className="text-xs text-primary-light/60">Device share sheet</p>
              </div>
            </button>
          </div>
        </div>

        {/* Quick Actions Row */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface-20 border border-tonal-20 hover:bg-surface-30 text-primary-light text-xs font-medium transition-colors"
          >
            {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            {copied ? 'Copied!' : 'Copy Link'}
          </button>
          <button
            onClick={handleEmail}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-surface-20 border border-tonal-20 hover:bg-surface-30 text-primary-light text-xs font-medium transition-colors"
          >
            <Mail size={14} />
            Email
          </button>
        </div>

        {/* In-Platform Routing (Send to Pharmacy / Pathology) */}
        {(onSendToPharmacy || onSendToPathology) && (
          <div className="pt-2 border-t border-tonal-20/50 space-y-2">
            <p className="text-xs font-semibold text-primary-light/50 uppercase tracking-wider">
              Send Within Aivion Care
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {onSendToPharmacy && (
                <button
                  onClick={() => { onClose(); onSendToPharmacy(); }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 text-left transition-colors"
                >
                  <Pill size={18} />
                  <div>
                    <p className="text-xs font-bold text-primary-light">Send to Pharmacy</p>
                    <p className="text-[10px] text-primary-light/60">For medicine fulfillment</p>
                  </div>
                </button>
              )}
              {onSendToPathology && (
                <button
                  onClick={() => { onClose(); onSendToPathology(); }}
                  className="flex items-center gap-2.5 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 text-left transition-colors"
                >
                  <TestTube size={18} />
                  <div>
                    <p className="text-xs font-bold text-primary-light">Send to Pathology</p>
                    <p className="text-[10px] text-primary-light/60">For lab test quotation</p>
                  </div>
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
}
