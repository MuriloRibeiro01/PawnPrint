import { create } from 'zustand';

// Definição dos Tipos (Models)
interface PetProfile {
  name: string;
  breed: string;
  age: number;
  weight: number;
  gender: string;
  imageUrl: string;
  birthDate: string;
  microchipId: string;
}

interface OwnerProfile {
  name: string;
  email: string;
  phone: string;
  address: string;
}

interface UserState {
  pet: PetProfile;
  owner: OwnerProfile;
  updatePet: (data: Partial<PetProfile>) => void;
  updateOwner: (data: Partial<OwnerProfile>) => void;
}

// Dados Iniciais (Mock)
export const useUserStore = create<UserState>((set) => ({
  pet: {
    name: "Max",
    breed: "Golden Retriever",
    age: 3,
    weight: 32,
    gender: "Macho",
    imageUrl: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=150&q=80",
    birthDate: "15/03/2022",
    microchipId: "982-000-123-456-789",
  },
  owner: {
    name: "Murilo Dev",
    email: "murilo@pawnprint.com",
    phone: "+55 (61) 99999-9999",
    address: "Brasília, DF",
  },
  updatePet: (data) => set((state) => ({ pet: { ...state.pet, ...data } })),
  updateOwner: (data) => set((state) => ({ owner: { ...state.owner, ...data } })),
}));