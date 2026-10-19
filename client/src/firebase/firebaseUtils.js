
import {
  doc,
  getDoc,
  setDoc,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  writeBatch,
} from "firebase/firestore";

import { db, auth } from "./firebase";

// ─── Default Listener Error Handler ────────────────────────

const handleListenerError = (name, error) => {
  console.error(`[Firestore] ${name} failed:`, {
    code: error.code,
    message: error.message,
    projectId: db.app.options.projectId,
    uid: auth.currentUser?.uid,
  });
};

// ─── Profile ───────────────────────────────────────────────

export const getProfile = async () => {
  const snap = await getDoc(doc(db, "profile", "main"));
  return snap.exists() ? snap.data() : null;
};

export const setProfile = async (data) => {
  console.log(
    "[Profile Save] Firebase project:",
    db.app.options.projectId
  );
  console.log(
    "[Profile Save] Current UID:",
    auth.currentUser?.uid
  );
  console.log("[Profile Save] Document path: profile/main");

  try {
    const user = auth.currentUser;

    if (!user) {
      throw new Error("You are not signed in. Please log in again.");
    }

    // ─── Admin Document Diagnostic ────────────────────────

    const userRef = doc(db, "users", user.uid);

    console.log(
      "[Admin Check] Project:",
      db.app.options.projectId
    );
    console.log(
      "[Admin Check] Database:",
      db._databaseId
    );
    console.log(
      "[Admin Check] Path:",
      userRef.path
    );

    const userSnap = await getDoc(userRef);

    console.log(
      "[Admin Check] Exists:",
      userSnap.exists()
    );

    if (userSnap.exists()) {
      console.log(
        "[Admin Check] Data:",
        userSnap.data()
      );
      console.log(
        "[Admin Check] Role:",
        userSnap.data().role
      );
    } else {
      console.error(
        "[Admin Check] User document was not found at:",
        userRef.path
      );
    }

    // ─── Save Profile ─────────────────────────────────────

    await setDoc(
      doc(db, "profile", "main"),
      {
        ...data,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );

    console.log(
      "[Profile Save] Profile saved successfully!"
    );
  } catch (error) {
    console.error("[Profile Save] Failed:", {
      code: error.code || "unknown",
      message: error.message,
      projectId: db.app.options.projectId,
      uid: auth.currentUser?.uid,
      documentPath: "profile/main",
    });

    throw error;
  }
};

export const subscribeProfile = (cb, onError) =>
  onSnapshot(
    doc(db, "profile", "main"),
    (snap) => {
      cb(snap.exists() ? snap.data() : null);
    },
    (error) => {
      handleListenerError("Profile listener", error);
      onError?.(error);
    }
  );

// ─── Generic CRUD ──────────────────────────────────────────

const colRef = (name) => collection(db, name);

export const getCollection = async (
  name,
  orderField = "order"
) => {
  try {
    const q = query(colRef(name), orderBy(orderField));
    const snap = await getDocs(q);

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  } catch (error) {
    console.error(
      `[Firestore] Ordered query failed for "${name}":`,
      {
        code: error.code,
        message: error.message,
      }
    );

    // Retry without ordering.
    const snap = await getDocs(colRef(name));

    return snap.docs.map((d) => ({
      id: d.id,
      ...d.data(),
    }));
  }
};

export const subscribeCollection = (
  name,
  cb,
  orderField = "order",
  onError
) => {
  const q = query(colRef(name), orderBy(orderField));

  return onSnapshot(
    q,
    (snap) => {
      cb(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    },
    (error) => {
      handleListenerError(`${name} listener`, error);
      onError?.(error);
    }
  );
};

export const addItem = (col, data) =>
  addDoc(colRef(col), {
    ...data,
    createdAt: serverTimestamp(),
  });

export const updateItem = (col, id, data) =>
  updateDoc(doc(db, col, id), {
    ...data,
    updatedAt: serverTimestamp(),
  });

export const deleteItem = (col, id) =>
  deleteDoc(doc(db, col, id));

// ─── Contact Messages ──────────────────────────────────────

// Public contact form submission.
export const addMessage = (data) =>
  addDoc(colRef("messages"), {
    ...data,
    read: false,
    createdAt: serverTimestamp(),
  });

// Admin message subscription.
export const subscribeMessages = (cb, onError) =>
  onSnapshot(
    query(colRef("messages"), orderBy("createdAt", "desc")),
    (snap) => {
      cb(
        snap.docs.map((d) => ({
          id: d.id,
          ...d.data(),
        }))
      );
    },
    (error) => {
      handleListenerError("Messages listener", error);
      onError?.(error);
    }
  );

// Mark a message as read.
export const markMessageRead = (id) =>
  updateDoc(doc(db, "messages", id), {
    read: true,
  });

// Delete a message.
export const deleteMessage = (id) =>
  deleteDoc(doc(db, "messages", id));

// ─── Seed Portfolio Data ───────────────────────────────────

export const seedToFirestore = async (seedData) => {
  const batch = writeBatch(db);

  // Profile
  batch.set(
    doc(db, "profile", "main"),
    {
      ...seedData.profile,
      updatedAt: serverTimestamp(),
    }
  );

  // Portfolio collections
  const collections = [
    { name: "projects", data: seedData.projects },
    { name: "skills", data: seedData.skills },
    { name: "experience", data: seedData.experience },
    { name: "education", data: seedData.education },
    { name: "certifications", data: seedData.certifications },
    { name: "achievements", data: seedData.achievements },
  ];

  for (const { name, data } of collections) {
    if (!Array.isArray(data)) {
      throw new Error(`Invalid seed data for "${name}"`);
    }

    const existing = await getDocs(colRef(name));

    existing.docs.forEach((d) => {
      batch.delete(d.ref);
    });

    data.forEach((item) => {
      const ref = doc(colRef(name));

      batch.set(ref, {
        ...item,
        createdAt: serverTimestamp(),
      });
    });
  }

  await batch.commit();
};
