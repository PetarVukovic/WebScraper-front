import { makeAutoObservable } from "mobx";

class UiStore {
  modalMode: "add" | "edit" = "add";
  error: string | null = null;
  loading: boolean = false;
  isModalOpen: boolean = false;

  constructor() {
    makeAutoObservable(this);
  }
}

export default UiStore;
