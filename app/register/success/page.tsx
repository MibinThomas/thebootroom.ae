export const metadata = {
  title: 'Registration Successful | The Bootroom',
};

export default function SuccessPage() {
  return (
    <main className="container mx-auto px-4 py-12 text-center">
      <h1 className="text-4xl font-heading uppercase text-primary mb-4">Registration Successful</h1>
      <p className="mb-6">Thank you for registering your team! We look forward to seeing you at the event.</p>
      <a href="/" className="text-primary underline">
        Return Home
      </a>
    </main>
  );
}