"use client";

import { useState } from "react";
import { useQRStore } from "@/lib/store/use-qr-store";
import { QRContentType } from "@/lib/types/qr";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Link, FileText, Wifi, Contact, Mail, Phone, MessageSquare, 
  MapPin, Calendar, CreditCard, FileUp, Share2 
} from "lucide-react";

const contentTypes: { id: QRContentType; label: string; icon: React.ElementType }[] = [
  { id: "url", label: "URL", icon: Link },
  { id: "text", label: "Text", icon: FileText },
  { id: "wifi", label: "Wi-Fi", icon: Wifi },
  { id: "vcard", label: "vCard", icon: Contact },
  { id: "email", label: "Email", icon: Mail },
  { id: "phone", label: "Phone", icon: Phone },
  { id: "sms", label: "SMS", icon: MessageSquare },
  { id: "whatsapp", label: "WhatsApp", icon: MessageSquare },
  { id: "location", label: "Location", icon: MapPin },
  { id: "event", label: "Event", icon: Calendar },
  { id: "social", label: "Social", icon: Share2 },
  { id: "payment", label: "Payment", icon: CreditCard },
  { id: "pdf", label: "PDF", icon: FileUp },
];

export function QRForms() {
  const { contentType, setContentType, setContent } = useQRStore();

  const [url, setUrl] = useState("https://");
  
  const [wifiSsid, setWifiSsid] = useState("");
  const [wifiPassword, setWifiPassword] = useState("");
  const [wifiEncryption, setWifiEncryption] = useState("WPA");
  const [wifiHidden, setWifiHidden] = useState(false);

  const [vcardFirst, setVcardFirst] = useState("");
  const [vcardLast, setVcardLast] = useState("");
  const [vcardPhone, setVcardPhone] = useState("");
  const [vcardEmail, setVcardEmail] = useState("");

  const [emailTo, setEmailTo] = useState("");
  const [emailSub, setEmailSub] = useState("");
  const [emailMsg, setEmailMsg] = useState("");

  const [phone, setPhone] = useState("");
  
  const [smsPhone, setSmsPhone] = useState("");
  const [smsMsg, setSmsMsg] = useState("");

  const [waCode, setWaCode] = useState("+1");
  const [waPhone, setWaPhone] = useState("");
  const [waMsg, setWaMsg] = useState("");

  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");

  const [evtTitle, setEvtTitle] = useState("");
  const [evtLoc, setEvtLoc] = useState("");
  const [evtStart, setEvtStart] = useState("");
  const [evtEnd, setEvtEnd] = useState("");

  const updateWifi = () => setContent(`WIFI:S:${wifiSsid};T:${wifiEncryption};P:${wifiPassword};H:${wifiHidden};;`);
  const updateVCard = () => setContent(`BEGIN:VCARD\nVERSION:3.0\nN:${vcardLast};${vcardFirst}\nFN:${vcardFirst} ${vcardLast}\nTEL;TYPE=cell:${vcardPhone}\nEMAIL:${vcardEmail}\nEND:VCARD`);
  const updateEmail = () => setContent(`MATMSG:TO:${emailTo};SUB:${emailSub};BODY:${emailMsg};;`);
  const updatePhone = () => setContent(`tel:${phone}`);
  const updateSms = () => setContent(`SMSTO:${smsPhone}:${smsMsg}`);
  const updateWa = () => setContent(`https://wa.me/${waCode.replace('+','')}${waPhone}?text=${encodeURIComponent(waMsg)}`);
  const updateLoc = () => setContent(`geo:${lat},${lng}`);
  const updateEvt = () => setContent(`BEGIN:VEVENT\nSUMMARY:${evtTitle}\nLOCATION:${evtLoc}\nDTSTART:${evtStart.replace(/[-:]/g,'')}Z\nDTEND:${evtEnd.replace(/[-:]/g,'')}Z\nEND:VEVENT`);

  return (
    <div className="flex flex-col border rounded-lg bg-card shadow-sm h-full max-h-full lg:max-h-[calc(100vh-12rem)]">
      <div className="p-4 border-b bg-muted/10">
        <Label className="mb-2 block text-sm font-medium">Select QR Code Type</Label>
        <Select value={contentType} onValueChange={(val: any) => setContentType(val)}>
          <SelectTrigger className="w-full bg-background">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {contentTypes.map((type) => {
              const Icon = type.icon;
              return (
                <SelectItem key={type.id} value={type.id}>
                  <div className="flex items-center gap-2">
                    <Icon className="w-4 h-4 text-muted-foreground" />
                    <span>{type.label}</span>
                  </div>
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>
      
      <div className="flex-1 p-6 overflow-y-auto">
        {contentType === "url" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Destination URL</Label>
              <Input type="url" placeholder="https://example.com" value={url} onChange={(e) => { setUrl(e.target.value); setContent(e.target.value); }} />
            </div>
          </div>
        )}

        {contentType === "text" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Plain Text</Label>
              <Textarea placeholder="Enter your message here..." className="min-h-[150px]" onChange={(e) => setContent(e.target.value)} />
            </div>
          </div>
        )}

        {contentType === "wifi" && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Network Name (SSID)</Label>
              <Input placeholder="My WiFi Network" value={wifiSsid} onChange={(e) => { setWifiSsid(e.target.value); setTimeout(updateWifi, 0); }} />
            </div>
            <div className="space-y-2">
              <Label>Password</Label>
              <Input type="password" placeholder="Network password" value={wifiPassword} onChange={(e) => { setWifiPassword(e.target.value); setTimeout(updateWifi, 0); }} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Security</Label>
                <Select value={wifiEncryption} onValueChange={(val) => { setWifiEncryption(val as string); setTimeout(updateWifi, 0); }}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA/WPA2</SelectItem>
                    <SelectItem value="WEP">WEP</SelectItem>
                    <SelectItem value="nopass">None</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2 pt-8">
                <Switch checked={wifiHidden} onCheckedChange={(val) => { setWifiHidden(val); setTimeout(updateWifi, 0); }} />
                <Label>Hidden Network</Label>
              </div>
            </div>
          </div>
        )}

        {contentType === "vcard" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>First Name</Label><Input value={vcardFirst} onChange={(e) => { setVcardFirst(e.target.value); setTimeout(updateVCard,0); }} /></div>
            <div className="space-y-2"><Label>Last Name</Label><Input value={vcardLast} onChange={(e) => { setVcardLast(e.target.value); setTimeout(updateVCard,0); }} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input type="tel" value={vcardPhone} onChange={(e) => { setVcardPhone(e.target.value); setTimeout(updateVCard,0); }} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={vcardEmail} onChange={(e) => { setVcardEmail(e.target.value); setTimeout(updateVCard,0); }} /></div>
          </div>
        )}

        {contentType === "email" && (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Recipient Email</Label><Input type="email" value={emailTo} onChange={(e) => { setEmailTo(e.target.value); setTimeout(updateEmail,0); }} /></div>
            <div className="space-y-2"><Label>Subject</Label><Input value={emailSub} onChange={(e) => { setEmailSub(e.target.value); setTimeout(updateEmail,0); }} /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={emailMsg} onChange={(e) => { setEmailMsg(e.target.value); setTimeout(updateEmail,0); }} /></div>
          </div>
        )}

        {contentType === "phone" && (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Telephone Number</Label><Input type="tel" value={phone} onChange={(e) => { setPhone(e.target.value); setTimeout(updatePhone,0); }} /></div>
          </div>
        )}

        {contentType === "sms" && (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Phone Number</Label><Input type="tel" value={smsPhone} onChange={(e) => { setSmsPhone(e.target.value); setTimeout(updateSms,0); }} /></div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={smsMsg} onChange={(e) => { setSmsMsg(e.target.value); setTimeout(updateSms,0); }} /></div>
          </div>
        )}

        {contentType === "whatsapp" && (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2"><Label>Country Code</Label><Input value={waCode} onChange={(e) => { setWaCode(e.target.value); setTimeout(updateWa,0); }} /></div>
              <div className="col-span-2 space-y-2"><Label>Phone Number</Label><Input type="tel" value={waPhone} onChange={(e) => { setWaPhone(e.target.value); setTimeout(updateWa,0); }} /></div>
            </div>
            <div className="space-y-2"><Label>Message</Label><Textarea value={waMsg} onChange={(e) => { setWaMsg(e.target.value); setTimeout(updateWa,0); }} /></div>
          </div>
        )}

        {contentType === "location" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Latitude</Label><Input type="number" step="any" value={lat} onChange={(e) => { setLat(e.target.value); setTimeout(updateLoc,0); }} /></div>
            <div className="space-y-2"><Label>Longitude</Label><Input type="number" step="any" value={lng} onChange={(e) => { setLng(e.target.value); setTimeout(updateLoc,0); }} /></div>
          </div>
        )}

        {contentType === "event" && (
          <div className="space-y-4">
            <div className="space-y-2"><Label>Event Title</Label><Input value={evtTitle} onChange={(e) => { setEvtTitle(e.target.value); setTimeout(updateEvt,0); }} /></div>
            <div className="space-y-2"><Label>Location</Label><Input value={evtLoc} onChange={(e) => { setEvtLoc(e.target.value); setTimeout(updateEvt,0); }} /></div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2"><Label className="leading-snug">Start Date & Time</Label><Input type="datetime-local" value={evtStart} onChange={(e) => { setEvtStart(e.target.value); setTimeout(updateEvt,0); }} /></div>
              <div className="space-y-2"><Label className="leading-snug">End Date & Time</Label><Input type="datetime-local" value={evtEnd} onChange={(e) => { setEvtEnd(e.target.value); setTimeout(updateEvt,0); }} /></div>
            </div>
          </div>
        )}

        {/* Generic fallback for others */}
        {["social", "payment", "pdf"].includes(contentType) && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>{contentTypes.find(c => c.id === contentType)?.label} URL</Label>
              <Input type="url" placeholder="https://" onChange={(e) => setContent(e.target.value)} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
