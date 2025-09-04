import data from '@/data/data.json';

export default function About() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <h1 className="text-4xl font-bold">About Me</h1>
      <p className="text-lg text-justify">
        {data.hero.bio}
      </p>
    </main>
  );
}
