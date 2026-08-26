import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  setDoc,
  updateDoc,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "@/firebase/config";
import type { Classe, Personagem } from "@/types";

// ---------------------------------------------------------------------------
// LISTAR — BUG 04 🐛 CORRIGIDO
// ---------------------------------------------------------------------------
export async function listarPersonagens(_uid: string): Promise<Personagem[]> {
  // Corrigido para buscar na coleção "personagens" (plural) e filtrar por userId
  const q = query(collection(db, "personagens"), where("userId", "==", _uid));

  const snap = await getDocs(q);
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Personagem));
}

// ---------------------------------------------------------------------------
// CRIAR — BUG 05 🐛
// ---------------------------------------------------------------------------
export async function criarPersonagem(
  uid: string,
  nome: string,
  classe: Classe
): Promise<string> {
  const ref = await addDoc(collection(db, "personagens"), {
    nome,
    classe,
    nivel: 1,
    xp: 0,
    userId: uid,
    criadoEm: serverTimestamp(),
  });
  return ref.id;
}

// ---------------------------------------------------------------------------
// BUSCAR UM PERSONAGEM
// ---------------------------------------------------------------------------
export async function buscarPersonagem(id: string): Promise<Personagem | null> {
  const snap = await getDoc(doc(db, "personagens", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() } as Personagem;
}

// ---------------------------------------------------------------------------
// EQUIPAR ITEM — BUG 06 🐛
// ---------------------------------------------------------------------------
export async function equiparItem(
  personagemId: string,
  slot: "arma" | "armadura" | "anel",
  itemId: string
): Promise<void> {
  await updateDoc(doc(db, "personagens", personagemId), { [slot]: itemId });
}

// ---------------------------------------------------------------------------
// DELETAR — BUG 07 🐛
// ---------------------------------------------------------------------------
export async function deletarPersonagem(
  personagem: Personagem,
  indice: number
): Promise<void> {
  await deleteDoc(doc(db, "personagens", personagem.id));
}

// ---------------------------------------------------------------------------
// ADICIONAR XP
// ---------------------------------------------------------------------------
export async function adicionarXP(personagemId: string, quantidade: number) {
  await updateDoc(doc(db, "personagens", personagemId), {
    xp: quantidade,
  });
}