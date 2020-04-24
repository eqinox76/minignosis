import { firestore } from "firebase";

export const EntryCollection = firestore().collection("entries");

// TODO find generic way of transforming data object to and from firestore
export class Entry {
  constructor(
    public url: string,
    public name?: string,
    public imageUrl?: string,
    public description?: string,
  ) {}

  static fromFirestore(snap: firestore.QueryDocumentSnapshot | firestore.DocumentSnapshot): Entry {
    return new Entry(
      snap.get("url"),
      snap.get("name"),
      snap.get("imageUrl"),
      snap.get("description"),
    )
  }

  toFirestore() {
    const result = new Map([
      ["url", this.url],
      ["name", this.name],
      ["imageUrl", this.imageUrl],
      ["description", this.description],
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

