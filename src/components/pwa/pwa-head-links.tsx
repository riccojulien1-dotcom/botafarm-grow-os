import splashScreens from "@/lib/pwa/generated-splash-screens.json";

export function PwaHeadLinks() {
  return (
    <>
      <link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="application-name" content="Botafarm" />
      {splashScreens.splashScreens.map((screen) => (
        <link
          key={screen.href}
          rel="apple-touch-startup-image"
          href={screen.href}
          media={screen.media}
        />
      ))}
    </>
  );
}
