import { useState, useRef } from "react";

const RegisterPage = () => {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    passport: "",
    expiry: "",
  });

  const [cameraOpen, setCameraOpen] = useState(false);
  const [capturedImage, setCapturedImage] = useState<Blob | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // 🔥 Open Camera
  const openCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      setStream(mediaStream);
      setCameraOpen(true);

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      console.error("Camera error:", err);
    }
  };

  // 🔥 Capture Photo
  const capturePhoto = async () => {
    if (!videoRef.current) return;

    const canvas = document.createElement("canvas");
    canvas.width = videoRef.current.videoWidth;
    canvas.height = videoRef.current.videoHeight;

    const ctx = canvas.getContext("2d");
    ctx?.drawImage(videoRef.current, 0, 0);

    const blob = await new Promise<Blob | null>((resolve) =>
      canvas.toBlob(resolve, "image/jpeg")
    );

    if (blob) {
      setCapturedImage(blob);
      stream?.getTracks().forEach((track) => track.stop());
      setCameraOpen(false);
    }
  };

  // 🔥 Submit Registration
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!capturedImage) {
      alert("Please capture biometric data first.");
      return;
    }

    const form = new FormData();
    form.append("name", formData.name);
    form.append("email", formData.email);
    form.append("passport", formData.passport);
    form.append("expiry", formData.expiry);
    form.append("file", capturedImage);

    try {
      const response = await fetch("http://localhost:8000/api/register", {
        method: "POST",
        body: form,
      });

      const data = await response.json();
      console.log(data);

      if (data.status === "SUCCESS") {
        setStep(1);
      } else {
        alert("Registration failed.");
      }
    } catch (err) {
      console.error("Register error:", err);
    }
  };

  if (step === 1) {
    return (
      <main className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="fixed inset-0 grid-bg pointer-events-none" />
        <div className="relative z-10 glass-panel-strong p-12 text-center max-w-md animate-scale-in">
          <h2 className="font-display text-2xl neon-text tracking-wider mb-3">
            REGISTERED
          </h2>
          <p className="font-body text-muted-foreground">
            Biometric profile created successfully.
          </p>
          <button
            onClick={() => {
              setStep(0);
              setFormData({ name: "", email: "", passport: "", expiry: "" });
              setCapturedImage(null);
            }}
            className="btn-ghost-neon mt-6"
          >
            NEW REGISTRATION
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="relative min-h-screen flex items-center justify-center overflow-hidden px-4">
      <div className="fixed inset-0 grid-bg pointer-events-none" />

      <div className="relative z-10 glass-panel p-8 md:p-12 w-full max-w-lg">
        <div className="text-center mb-8">
          <h1 className="font-display text-2xl neon-text-subtle mb-2">
            REGISTER
          </h1>
          <p className="font-body text-muted-foreground text-sm tracking-wider">
            BIOMETRIC PROFILE ENROLLMENT
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) =>
              setFormData({ ...formData, name: e.target.value })
            }
            className="neon-input w-full"
            placeholder="Full Name"
          />

          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) =>
              setFormData({ ...formData, email: e.target.value })
            }
            className="neon-input w-full"
            placeholder="Email"
          />

          <input
            type="text"
            required
            value={formData.passport}
            onChange={(e) =>
              setFormData({ ...formData, passport: e.target.value })
            }
            className="neon-input w-full"
            placeholder="Passport Number"
          />

          <input
            type="date"
            required
            value={formData.expiry}
            onChange={(e) =>
              setFormData({ ...formData, expiry: e.target.value })
            }
            className="neon-input w-full"
          />

          {/* 🔥 Biometric Capture */}
          <div>
            <div
              onClick={openCamera}
              className="border-2 border-dashed border-border/40 rounded-lg p-6 text-center cursor-pointer hover:border-primary/40"
            >
              {capturedImage ? (
                <p className="text-primary font-body">
                  Biometric Captured ✔
                </p>
              ) : (
                <p className="font-body text-muted-foreground">
                  TAP TO CAPTURE BIOMETRIC DATA
                </p>
              )}
            </div>

            {cameraOpen && (
              <div className="mt-4">
                <video
                  ref={videoRef}
                  autoPlay
                  className="w-full rounded-lg"
                />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="btn-neon mt-4 w-full"
                >
                  CAPTURE
                </button>
              </div>
            )}
          </div>

          <button type="submit" className="btn-neon w-full mt-4">
            ENROLL PROFILE
          </button>
        </form>
      </div>
    </main>
  );
};

export default RegisterPage;