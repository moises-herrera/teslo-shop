import { titleFont } from '@/config/fonts';

export default function AuthPage() {
  return (
    <main>
      <h1>Home</h1>
      <h1 className={`${titleFont.className} font-bold`}>Hola Mundo</h1>
    </main>
  );
}
