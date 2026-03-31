const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

const genHash = (len = 8) => {
  const chars = "abcdef0123456789";
  let s = "";
  for (let i = 0; i < len; i++) s += chars[Math.floor(Math.random() * chars.length)];
  return s.toUpperCase();
};

export async function runDecryption(label: string, unlockStage: number, addHistory: (entry: any) => void, playBeep: () => void) {
  const hash = genHash(10);
  addHistory({ type: "text", value: `[ DECRYPT :: ${label.toUpperCase()} ] HASH: ${hash}`, tone: "dim" });
  addHistory({ type: "text", value: "Initializing key exchange...", tone: "dim" });
  await sleep(300 + Math.floor(Math.random() * 300));
  addHistory({ type: "text", value: "Performing brute-force pass (simulated)...", tone: "dim" });
  await sleep(600 + Math.floor(Math.random() * 500));
  addHistory({ type: "text", value: "Applying adaptive XOR...", tone: "dim" });
  await sleep(400 + Math.floor(Math.random() * 400));
  addHistory({ type: "text", value: "Decryption successful.", tone: "success" });
  try {
    playBeep();
  } catch {}
  addHistory({ type: "text", value: `[ ${label.toUpperCase()} ] UNLOCKED (${unlockStage})`, tone: "success" });
}
