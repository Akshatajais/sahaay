import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { HomeGate, Shell } from "./components/Shell.tsx";
import { ContactFormPage, ContactsPage } from "./pages/Contacts.tsx";
import { FamilyPage, HelpPage } from "./pages/Help.tsx";
import { HomePage } from "./pages/HomePage.tsx";
import { MedicineDetailPage, MedicineSuccessPage, MedicinesPage } from "./pages/Medicines.tsx";
import { MoneyPage, PaymentResultPage, ReceivePage, SendMoneyPage } from "./pages/Money.tsx";
import { MyDayPage } from "./pages/MyDay.tsx";
import { NotificationsPage } from "./pages/Notifications.tsx";
import { Onboarding } from "./pages/Onboarding.tsx";
import { SettingsPage } from "./pages/Settings.tsx";
import { VoicePage } from "./pages/VoicePage.tsx";
import { AppProvider } from "./state/AppState.tsx";

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/welcome" element={<Onboarding />} />
          <Route element={<Shell />}>
            <Route path="/" element={<HomeGate />} />
            <Route path="/home" element={<HomePage />} />
            <Route path="/medicines" element={<MedicinesPage />} />
            <Route path="/medicines/:id" element={<MedicineDetailPage />} />
            <Route path="/medicines/:id/done" element={<MedicineSuccessPage />} />
            <Route path="/money" element={<MoneyPage />} />
            <Route path="/money/send" element={<SendMoneyPage />} />
            <Route path="/money/receive" element={<ReceivePage />} />
            <Route path="/money/result/:id" element={<PaymentResultPage />} />
            <Route path="/voice" element={<VoicePage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/help/family" element={<FamilyPage />} />
            <Route path="/day" element={<MyDayPage />} />
            <Route path="/contacts" element={<ContactsPage />} />
            <Route path="/contacts/new" element={<ContactFormPage />} />
            <Route path="/contacts/:id" element={<ContactFormPage />} />
            <Route path="/notifications" element={<NotificationsPage />} />
            <Route path="/settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}
