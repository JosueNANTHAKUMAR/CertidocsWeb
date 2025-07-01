import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaWallet, FaRegCopy, FaCheckCircle, FaTimesCircle, FaSpinner } from "react-icons/fa";

// Utilitaire pour raccourcir une adresse
function shortAddress(addr: string) {
  return addr ? addr.slice(0, 6) + "..." + addr.slice(-4) : "";
}

const fakeAddress = "0x2AaB3F4e5C6D7E8F9aBcDeF1aCcf";

const CHECKLIST_STEPS = [
  { label: "Saisie de l'ID", key: "id" },
  { label: "Saisie du message", key: "msg" },
  { label: "Vérification", key: "verify" },
  { label: "Résultat", key: "result" },
];

const SignatureVerifier: React.FC = () => {
  const [address] = useState<string>(fakeAddress); // À remplacer par la vraie adresse connectée
  const [copied, setCopied] = useState(false);
  const [signatureId, setSignatureId] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<null | "loading" | "success" | "error">(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [shake, setShake] = useState(false);
  const idInputRef = useRef<HTMLInputElement>(null);
  const msgInputRef = useRef<HTMLTextAreaElement>(null);

  // Détermination de l'étape active
  let checklistStep = 0;
  if (signatureId.length > 0) checklistStep = 1;
  if (signatureId.length > 0 && message.length > 0) checklistStep = 2;
  if (status === "loading") checklistStep = 3;
  if (status === "success" || status === "error") checklistStep = 4;

  // Toast auto-hide
  React.useEffect(() => {
    if (toast) {
      const t = setTimeout(() => setToast(null), 2200);
      return () => clearTimeout(t);
    }
  }, [toast]);

  // Animation secousse sur erreur
  React.useEffect(() => {
    if (shake) {
      const t = setTimeout(() => setShake(false), 600);
      return () => clearTimeout(t);
    }
  }, [shake]);

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setToast({ type: "success", msg: "Adresse copiée !" });
    setTimeout(() => setCopied(false), 1200);
  };

  const handleVerify = async () => {
    setStatus("loading");
    await new Promise((res) => setTimeout(res, 900));
    // Simule la vérification (à remplacer par la vraie logique)
    if (signatureId.startsWith("0x") && message.length > 0) {
      setStatus("success");
      setToast({ type: "success", msg: "Signature valide !" });
    } else {
      setStatus("error");
      setToast({ type: "error", msg: "Signature invalide ou champs manquants." });
      setShake(true);
    }
  };

  return (
    <motion.div
      className="w-full max-w-md mx-auto p-6 rounded-2xl shadow-2xl bg-white/70 dark:bg-[#18192b]/80 backdrop-blur-xl border border-violet-200 dark:border-violet-900 relative"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, type: "spring" }}
    >
      {/* Checklist animée */}
      <motion.ul className="flex flex-col gap-2 mb-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.09 } },
        }}
        aria-label="Étapes de vérification"
      >
        {CHECKLIST_STEPS.map((stepObj, idx) => (
          <motion.li
            key={stepObj.key}
            className={`flex items-center gap-3 text-base font-medium select-none ${idx < checklistStep ? "text-emerald-500" : idx === checklistStep ? "text-violet-600 dark:text-violet-300" : "text-gray-400 dark:text-gray-600"}`}
            variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
            aria-current={idx === checklistStep ? "step" : undefined}
          >
            <span className="inline-flex items-center justify-center w-6 h-6 rounded-full border-2 border-violet-200 dark:border-violet-700 bg-white dark:bg-[#23244a]">
              {idx < checklistStep ? (
                <motion.span
                  initial={{ scale: 0.7, opacity: 0 }}
                  animate={{ scale: 1.2, opacity: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 12 }}
                >
                  <FaCheckCircle className="text-emerald-400" />
                </motion.span>
              ) : idx === checklistStep ? (
                status === "error" && idx === CHECKLIST_STEPS.length - 1 ? (
                  <FaTimesCircle className="text-red-400" />
                ) : status === "loading" && idx === 3 ? (
                  <FaSpinner className="animate-spin text-violet-400" />
                ) : (
                  <span className="w-2 h-2 bg-violet-400 rounded-full block"></span>
                )
              ) : (
                <span className="w-2 h-2 bg-gray-300 dark:bg-gray-700 rounded-full block"></span>
              )}
            </span>
            <span>{stepObj.label}</span>
          </motion.li>
        ))}
      </motion.ul>
      {/* Header Wallet */}
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          className="p-3 rounded-full bg-gradient-to-tr from-violet-400 to-emerald-200 shadow-md"
          initial={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
        >
          <FaWallet className="text-violet-700 text-2xl" />
        </motion.div>
        <span className="font-mono text-lg text-violet-800 dark:text-violet-200 select-all">
          {shortAddress(address)}
        </span>
        <button
          aria-label="Copier l'adresse"
          className="ml-2 p-2 rounded-full bg-violet-100 dark:bg-violet-900 hover:bg-violet-200 dark:hover:bg-violet-800 transition shadow"
          onClick={handleCopy}
        >
          {copied ? <FaCheckCircle className="text-emerald-400" /> : <FaRegCopy className="text-violet-600" />}
        </button>
      </div>

      {/* Formulaire */}
      <motion.form
        className="flex flex-col gap-5"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: { transition: { staggerChildren: 0.12 } },
        }}
        onSubmit={e => { e.preventDefault(); handleVerify(); }}
        aria-label="Vérification de signature"
      >
        {/* Champ ID signature */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <label htmlFor="signatureId" className="block text-sm font-semibold text-violet-700 dark:text-violet-200 mb-1">
            ID de la signature
          </label>
          <motion.input
            ref={idInputRef}
            id="signatureId"
            type="text"
            autoComplete="off"
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all bg-white/80 dark:bg-[#23244a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-mono text-base shadow-sm ${shake && !signatureId.startsWith("0x") ? "border-red-400 animate-shake" : "border-violet-200 focus:border-violet-500 dark:border-violet-800 dark:focus:border-violet-400"}`}
            placeholder="0x..."
            value={signatureId}
            onChange={e => setSignatureId(e.target.value)}
            aria-label="ID de la signature"
            aria-invalid={status === "error" && !signatureId.startsWith("0x")}
            aria-live="polite"
            disabled={status === "loading"}
          />
        </motion.div>
        {/* Champ message signé */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <label htmlFor="messageInput" className="block text-sm font-semibold text-violet-700 dark:text-violet-200 mb-1">
            Message signé
          </label>
          <motion.textarea
            ref={msgInputRef}
            id="messageInput"
            rows={4}
            className={`w-full px-4 py-3 rounded-xl border-2 focus:outline-none transition-all bg-white/80 dark:bg-[#23244a] text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 font-mono text-base shadow-sm resize-none ${shake && message.length === 0 ? "border-red-400 animate-shake" : "border-violet-200 focus:border-violet-500 dark:border-violet-800 dark:focus:border-violet-400"}`}
            placeholder="Écris le message ici..."
            value={message}
            onChange={e => setMessage(e.target.value)}
            aria-label="Message signé"
            aria-invalid={status === "error" && message.length === 0}
            aria-live="polite"
            disabled={status === "loading"}
          />
        </motion.div>
        {/* Bouton vérifier */}
        <motion.div
          variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
        >
          <motion.button
            type="submit"
            className={`w-full py-3 rounded-full font-bold text-lg bg-gradient-to-r from-violet-500 to-emerald-400 text-white shadow-lg transition-all focus:outline-none focus:ring-2 focus:ring-violet-400 focus:ring-offset-2 focus:ring-offset-white dark:focus:ring-offset-[#18192b] ${status === "loading" ? "cursor-wait opacity-80" : "hover:scale-[1.03] active:scale-95"}`}
            whileHover={{ y: -2, boxShadow: "0 8px 32px #9584ff33" }}
            whileTap={{ scale: 0.97 }}
            disabled={status === "loading"}
            aria-label="Vérifier la signature"
            aria-busy={status === "loading"}
          >
            <AnimatePresence mode="wait" initial={false}>
              {status === "loading" ? (
                <motion.span
                  key="loading"
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                >
                  <FaSpinner className="animate-spin" /> En cours...
                </motion.span>
              ) : status === "success" ? (
                <motion.span
                  key="success"
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                >
                  <FaCheckCircle className="text-emerald-400" /> Succès
                </motion.span>
              ) : status === "error" ? (
                <motion.span
                  key="error"
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                >
                  <FaTimesCircle className="text-red-400" /> Erreur
                </motion.span>
              ) : (
                <motion.span
                  key="default"
                  className="flex items-center justify-center gap-2"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ duration: 0.25 }}
                >
                  Vérifier la signature
                </motion.span>
              )}
            </AnimatePresence>
          </motion.button>
        </motion.div>
      </motion.form>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            className={`fixed bottom-6 right-6 z-50 px-5 py-3 rounded-xl shadow-xl text-white font-semibold text-base ${toast.type === "success" ? "bg-emerald-500" : "bg-red-500"}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 30 }}
            transition={{ duration: 0.35 }}
            aria-live="polite"
          >
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      {/* Animation shake */}
      <style>{`
        .animate-shake {
          animation: shakeX 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
        @keyframes shakeX {
          10%, 90% { transform: translateX(-2px); }
          20%, 80% { transform: translateX(4px); }
          30%, 50%, 70% { transform: translateX(-8px); }
          40%, 60% { transform: translateX(8px); }
        }
      `}</style>
    </motion.div>
  );
};

export default SignatureVerifier; 