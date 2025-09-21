import { create } from "zustand";

export const useInspectionStore = create((set) => ({
  clientName: "",
  address: "",
  phoneNumber: "",
  facadePhotoUri: "",
  buildingType: "",
  floor: "",
  methods: {},
  photoBlocks: [],
  sonarPhotos: [],
  cameraPathStart: [],  // 🔹 tableau vide au lieu d'objet
  cameraPathSteps: [],
  cameraPathEnd: [],
  solutions: [],

  // setters
  setField: (field, value) => set((state) => ({ ...state, [field]: value })),
  reset: () =>
    set({
      clientName: "",
      address: "",
      phoneNumber: "",
      facadePhotoUri: "",
      buildingType: "",
      floor: "",
      methods: {},
      photoBlocks: [],
      sonarPhotos: [],
      cameraPathStart: [],
      cameraPathSteps: [],
      cameraPathEnd: [],
      solutions: [],
    }),
}));
