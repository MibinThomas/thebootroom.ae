"use client";

import { useState } from 'react';
import TermsModal from './TermsModal';

interface Player {
  name: string;
  jerseyNumber: string;   // ✅ NEW
  jerseySize: string;
  preferredPosition: string;
}


/**
 * Team registration form component. Collects team, company, and contact details
 * alongside player information and optional file uploads. Validates basic
 * requirements client-side and submits data as multipart/form-data to the API.
 */
export default function TeamRegistrationForm() {
  const [teamName, setTeamName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companySector, setCompanySector] = useState('');
  const [companyAddress, setCompanyAddress] = useState('');
  const [managerName, setManagerName] = useState('');
  const [managerEmail, setManagerEmail] = useState('');
  const [managerPhone, setManagerPhone] = useState('');
  const [captainName, setCaptainName] = useState('');
  const [captainEmail, setCaptainEmail] = useState('');
  const [captainPhone, setCaptainPhone] = useState('');
  const [players, setPlayers] = useState<Player[]>(
  Array.from({ length: 10 }, () => ({
    name: "",
    jerseySize: "M",
    preferredPosition: "",
    jerseyNumber: "", // ✅ add
  }))
);


  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [guidelinesFile, setGuidelinesFile] = useState<File | null>(null);
  // Checkbox states
  const [confirmEmployees, setConfirmEmployees] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Terms derived from the contract; truncated for brevity.
  const termsText = `Participation Terms:\n1. Each entry must be a corporate team of up to ten players.\n2. All players must be employees of the company.\n3. Payment of AED 3,500 + VAT per team is due within 3 days of registration.\n4. Cancellations within 7 days of the event incur a 50% fee; within 3 days no refund.\n5. The Bootroom and venue are not liable for injuries or loss.\n6. Teams consent to photography and promotional use of images.\n7. Teams must submit final player names 14 days before the event.`;

  const handlePlayerChange = (index: number, field: keyof Player, value: any) => {
    setPlayers((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, [field]: value } : p))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Prevent submission if form is incomplete
    if (!canSubmit) {
      alert('Please complete all required fields and agree to the terms before submitting.');
      return;
    }
    setSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('teamName', teamName);
      formData.append('companyName', companyName);
      formData.append('companySector', companySector);
      formData.append('companyAddress', companyAddress);
      formData.append('managerName', managerName);
      formData.append('managerEmail', managerEmail);
      formData.append('managerPhone', managerPhone);
      formData.append('captainName', captainName);
      formData.append('captainEmail', captainEmail);
      formData.append('captainPhone', captainPhone);
      players.forEach((player, idx) => {
        formData.append(`players[${idx}][name]`, player.name);
        formData.append(`players[${idx}][jerseyNumber]`, player.jerseyNumber); // ✅
        formData.append(`players[${idx}][jerseySize]`, player.jerseySize);
        formData.append(`players[${idx}][preferredPosition]`, player.preferredPosition);
      });

      if (logoFile) formData.append('logo', logoFile);
      if (guidelinesFile) formData.append('guidelines', guidelinesFile);
      const response = await fetch('/api/teams', {
        method: 'POST',
        body: formData,
      });
      if (response.ok) {
        const data = await response.json();
        if (data?.teamId) {
          window.location.href = `/register/success?teamId=${data.teamId}`;
        } else {
          window.location.href = '/register/success';
        }
      } else {
        const data = await response.json();
        alert(data.error || 'Something went wrong.');
      }

    } catch (error) {
      console.error(error);
      alert('An unexpected error occurred.');
    } finally {
      setSubmitting(false);
    }
  };

  // Determine if all required team fields and players are completed
  const isTeamComplete =
    teamName.trim() &&
    companyName.trim() &&
    companySector.trim() &&
    companyAddress.trim() &&
    managerName.trim() &&
    managerEmail.trim() &&
    managerPhone.trim() &&
    captainName.trim() &&
    captainEmail.trim() &&
    captainPhone.trim();

  const arePlayersComplete = players.every(
  (p) =>
    p.name.trim() &&
    p.preferredPosition.trim() &&
    p.jerseySize.trim() &&
    p.jerseyNumber.trim() // ✅ NEW
);

  const canSubmit =
    !submitting && confirmEmployees && agreeTerms && isTeamComplete && arePlayersComplete;

  return (
    <div className="max-w-5xl mx-auto bg-panel border-4 border-secondary rounded-xl shadow-lg overflow-hidden">
      {/* Page header inside the form container */}
      <h1 className="bg-primary text-secondary text-center text-3xl font-heading py-4">Team Registration</h1>
      <form onSubmit={handleSubmit} className="p-6 space-y-8">
        {/* Team Details Section */}
        <section>
          <h2 className="bg-primary text-secondary uppercase font-heading px-4 py-2 rounded">Team Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className="sr-only">Team Name</label>
              <input
                type="text"
                placeholder="Team Name"
                className="placeholder-secondary placeholder-opacity-70"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Company Name</label>
              <input
                type="text"
                placeholder="Company Name"
                className="placeholder-secondary placeholder-opacity-70"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Company Sector</label>
              <input
                type="text"
                placeholder="Company Sector"
                className="placeholder-secondary placeholder-opacity-70"
                value={companySector}
                onChange={(e) => setCompanySector(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Company Address</label>
              <input
                type="text"
                placeholder="Company Address"
                className="placeholder-secondary placeholder-opacity-70"
                value={companyAddress}
                onChange={(e) => setCompanyAddress(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Manager Name</label>
              <input
                type="text"
                placeholder="Manager Name"
                className="placeholder-secondary placeholder-opacity-70"
                value={managerName}
                onChange={(e) => setManagerName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Manager Email</label>
              <input
                type="email"
                placeholder="Manager Email"
                className="placeholder-secondary placeholder-opacity-70"
                value={managerEmail}
                onChange={(e) => setManagerEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Manager Phone</label>
              <input
                type="tel"
                placeholder="Manager Phone"
                className="placeholder-secondary placeholder-opacity-70"
                value={managerPhone}
                onChange={(e) => setManagerPhone(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Captain Name</label>
              <input
                type="text"
                placeholder="Captain Name"
                className="placeholder-secondary placeholder-opacity-70"
                value={captainName}
                onChange={(e) => setCaptainName(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Captain Email</label>
              <input
                type="email"
                placeholder="Captain Email"
                className="placeholder-secondary placeholder-opacity-70"
                value={captainEmail}
                onChange={(e) => setCaptainEmail(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="sr-only">Captain Phone</label>
              <input
                type="tel"
                placeholder="Captain Phone"
                className="placeholder-secondary placeholder-opacity-70"
                value={captainPhone}
                onChange={(e) => setCaptainPhone(e.target.value)}
                required
              />
            </div>
          </div>
        </section>
        {/* Player Registration Section */}
        <section>
          <h2 className="bg-primary text-secondary uppercase font-heading px-4 py-2 rounded">Player Registration</h2>
          <p className="text-secondary mt-4">Please provide details for each player on your team.</p>
          {players.map((player, idx) => (
            <div key={idx} className="mt-4 border border-secondary rounded">
              <h3 className="bg-primary text-secondary font-heading px-4 py-2">Player {idx + 1}</h3>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3 p-4 bg-panel">                {/* Player full name */}
                <input
                  type="text"
                  placeholder="Player Full Name"
                  value={player.name}
                  onChange={(e) => handlePlayerChange(idx, 'name', e.target.value)}
                  className="col-span-1 md:col-span-1 placeholder-secondary placeholder-opacity-70"
                  required
                />
                {/* Preferred position */}
                <input
                  type="text"
                  placeholder="Preferred Position"
                  value={player.preferredPosition}
                  onChange={(e) => handlePlayerChange(idx, 'preferredPosition', e.target.value)}
                  className="col-span-1 md:col-span-1 placeholder-secondary placeholder-opacity-70"
                  required
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Jersey Number"
                  value={player.jerseyNumber}
                  onChange={(e) =>
                    handlePlayerChange(
                      idx,
                      "jerseyNumber",
                      e.target.value.replace(/[^0-9]/g, "").slice(0, 3) // keeps only digits
                    )
                  }
                  className="col-span-1 placeholder-secondary placeholder-opacity-70"
                  required
                />

                {/* Jersey size selector buttons */}
                <div className="flex items-center space-x-1">
                  {['S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                    <button
                      type="button"
                      key={size}
                      onClick={() => handlePlayerChange(idx, 'jerseySize', size)}
                      className={`px-2 py-1 border border-secondary rounded font-heading ${player.jerseySize === size
                          ? 'bg-primary text-secondary'
                          : 'bg-panel text-primary'
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </section>
        {/* File Uploads Section */}
        <section>
          <h2 className="bg-primary text-secondary uppercase font-heading px-4 py-2 rounded">Uploads</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
            <div>
              <label className="block mb-1 font-heading text-secondary">Company Logo (PDF)</label>
              <input
                type="file"
                accept="application/pdf,image/*"
                onChange={(e) => setLogoFile(e.target.files?.[0] ?? null)}
              />
            </div>
            <div>
              <label className="block mb-1 font-heading text-secondary">Brand Guidelines (PDF)</label>
              <input
                type="file"
                accept="application/pdf"
                onChange={(e) => setGuidelinesFile(e.target.files?.[0] ?? null)}
              />
            </div>
          </div>
          {/* Agreements and terms section integrated with uploads */}
          <div className="p-4 flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            {/* Checkbox block */}
            <div className="flex flex-col space-y-4">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={confirmEmployees}
                  onChange={(e) => setConfirmEmployees(e.target.checked)}
                  className="h-5 w-5 mt-0.5 accent-secondary"
                  required
                />
                <span className="text-sm text-primary leading-6">
                  I confirm all players are company employees
                </span>
              </label>
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="h-5 w-5 mt-0.5 accent-secondary"
                  required
                />
                <span className="text-sm text-primary leading-6">
                  I agree to the tournament rules &amp; code of conduct
                </span>
              </label>
            </div>
            {/* Terms modal button */}
            <div className="flex justify-start md:justify-end items-start">
              <TermsModal terms={termsText} />
            </div>
          </div>
        </section>
        {/* Footer Section */}
        <div className="flex items-center justify-between pt-4">
          <span className="font-heading text-secondary">
            {players.length} to be players added
          </span>
          <button
            type="submit"
            disabled={!canSubmit}
            className={`bg-secondary text-primary font-heading py-4 px-8 rounded shadow uppercase tracking-wider ${canSubmit ? '' : 'opacity-50 cursor-not-allowed'
              }`}
          >
            {submitting ? 'Submitting…' : 'Register Team'}
          </button>
        </div>
      </form>
    </div>
  );
}