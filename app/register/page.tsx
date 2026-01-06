import TeamRegistrationForm from '../../components/TeamRegistrationForm';

export const metadata = {
  title: 'Register Team | The Bootroom',
};

export default function RegisterPage() {
  return (
    <main className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-heading uppercase text-primary mb-6">Team Registration</h1>
      <TeamRegistrationForm />
    </main>
  );
}