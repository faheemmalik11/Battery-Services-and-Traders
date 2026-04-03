export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold">Contact</h1>
      <p className="mt-4 text-muted-foreground">
        Email us at <span className="font-medium text-foreground">info@batteryservices.com</span>
        {" "}or call <span className="font-medium text-foreground">+1 (555) 123-4567</span>.
      </p>
    </div>
  );
}

