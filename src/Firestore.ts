import { firestore } from "firebase";

export const EntryCollection = firestore().collection("entries");

// TODO find generic way of transforming data object to and from firestore
export class Entry {
  constructor(
    public url: string,
    public name?: string,
    public imageUrl?: string,
    public description?: string,
    public tags?: string[],
    public search?: string[],
    public added?: firestore.Timestamp,
    public text?: string
  ) {
  }

  static fromFirestore(snap: firestore.QueryDocumentSnapshot | firestore.DocumentSnapshot): Entry {
    return new Entry(
      snap.get("url"),
      snap.get("name"),
      snap.get("imageUrl"),
      snap.get("description"),
      snap.get("tags"),
      snap.get("search"),
      snap.get("added"),
      snap.get("text")
    )
  }

  toFirestore() {
    const result = new Map<string, any>([
      ["url", this.url],
      ["name", this.name],
      ["imageUrl", this.imageUrl],
      ["description", this.description],
      ["tags", this.tags],
      // search shall not be modified by the frontend
      ["added", this.added === undefined ? firestore.FieldValue.serverTimestamp() : this.added],
      ["text", this.text]
    ]);
    return Array.from(result).reduce((obj: any, [key, value]) => {
      // need to filter undefined values for the firestore api
      if (value !== undefined) {
        obj[key] = value;
      }
      return obj;
    }, {});
  }
}

export class Tags {
  static async fromFirestore(): Promise<string[]> {
    return firestore().collection("meta")
      .doc("meta")
      .get()
      .then((doc) => doc.get("tags") ?? [])
  }

  static async addToFirestore(newTag: string) {
    this.fromFirestore()
      .then((tags) => {
        tags.push(newTag);
        tags.sort((a: string, b: string) => a.localeCompare(b));
        firestore().collection("meta")
          .doc("meta")
          .update("tags", tags);
      })
  }
}

