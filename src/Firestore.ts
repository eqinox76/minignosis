import { firestore } from "firebase";

export const EntryCollection = firestore().collection("entries");

// TODO find generic way of transforming data object to and from firestore
export class Entry {
  constructor(
    private _url: string,
    public name?: string,
  ) {
    this.url = _url;
  }

  public set url(url: string) {
    // decode url encoding and remove the protocol to better deduplicate
    const decoded = decodeURI(url);
    if (!decoded.includes("http")) {
      this._url = "https://" + decoded
    } else {
      this._url = decoded
    }
  }

  public get url(): string {
    return this._url;
  }

  static fromFirestore(snap: firestore.QueryDocumentSnapshot | firestore.DocumentSnapshot): Entry {
    return new Entry(
      snap.get("url"),
      snap.get("name"),
    )
  }

  toFirestore() {
    const result = new Map([
      ["url", this.url],
      ["name", this.name],
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

