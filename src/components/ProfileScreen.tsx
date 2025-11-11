import {
  Bell,
  Calendar,
  ChevronRight,
  Dog,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react-native";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

import { ImageWithFallback } from "./ImageWithFallback";

interface ProfileScreenProps {
  pet: {
    name: string;
    breed: string;
    age: number;
    weight: number;
    gender: string;
    imageUrl: string;
    birthDate: string;
    microchipId: string;
  };
  owner: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
}

export function ProfileScreen({ pet, owner }: ProfileScreenProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Perfil do Pet</Text>
          <Pressable style={styles.iconButton}>
            <Edit color="#f97316" size={18} />
          </Pressable>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarRing}>
            <ImageWithFallback
              uri={pet.imageUrl}
              style={styles.avatar}
              fallbackLabel="Pet"
            />
          </View>
          <Text style={styles.profileName}>{pet.name}</Text>
          <Text style={styles.profileSubtitle}>{pet.breed}</Text>
        </View>

        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <Dog color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Raça</Text>
              <Text style={styles.infoValue}>{pet.breed}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Calendar color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Idade / Data de Nascimento</Text>
              <Text style={styles.infoValue}>
                {pet.age} anos • {pet.birthDate}
              </Text>
            </View>
          </View>

          <View style={styles.dualRow}>
            <View style={styles.dualColumn}>
              <Text style={styles.infoLabel}>Peso</Text>
              <Text style={styles.infoValue}>{pet.weight} kg</Text>
            </View>
            <View style={styles.dualColumn}>
              <Text style={styles.infoLabel}>Sexo</Text>
              <Text style={styles.infoValue}>{pet.gender}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Shield color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>ID do Microchip</Text>
              <Text style={[styles.infoValue, styles.mono]}>{pet.microchipId}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Perfil do Dono</Text>
          <Pressable style={styles.iconButton}>
            <Edit color="#f97316" size={18} />
          </Pressable>
        </View>

        <View style={styles.infoList}>
          <View style={styles.infoRow}>
            <User color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nome</Text>
              <Text style={styles.infoValue}>{owner.name}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Mail color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Email</Text>
              <Text style={styles.infoValue}>{owner.email}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Phone color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Telefone</Text>
              <Text style={styles.infoValue}>{owner.phone}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <MapPin color="#6b7280" size={18} />
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Endereço</Text>
              <Text style={styles.infoValue}>{owner.address}</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configurações</Text>
        <View style={styles.settingsList}>
          <Pressable style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Bell color="#6b7280" size={18} />
              <Text style={styles.infoValue}>Notificações</Text>
            </View>
            <ChevronRight color="#9ca3af" size={18} />
          </Pressable>

          <Pressable style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <Shield color="#6b7280" size={18} />
              <Text style={styles.infoValue}>Privacidade</Text>
            </View>
            <ChevronRight color="#9ca3af" size={18} />
          </Pressable>

          <Pressable style={styles.settingsRow}>
            <View style={styles.settingsLeft}>
              <MapPin color="#6b7280" size={18} />
              <Text style={styles.infoValue}>Zonas Seguras</Text>
            </View>
            <ChevronRight color="#9ca3af" size={18} />
          </Pressable>
        </View>
      </View>

      <View style={[styles.card, styles.sunsetCard]}>
        <Text style={styles.cardTitle}>Informações da Coleira</Text>
        <View style={styles.dualColumnList}>
          <View style={styles.dualRowItem}>
            <Text style={styles.infoLabel}>Modelo</Text>
            <Text style={styles.infoValue}>SmartPet Pro X</Text>
          </View>
          <View style={styles.dualRowItem}>
            <Text style={styles.infoLabel}>Número de Série</Text>
            <Text style={[styles.infoValue, styles.mono]}>SP-2024-7821</Text>
          </View>
          <View style={styles.dualRowItem}>
            <Text style={styles.infoLabel}>Firmware</Text>
            <Text style={styles.infoValue}>v2.4.1</Text>
          </View>
          <View style={styles.dualRowItem}>
            <Text style={styles.infoLabel}>Último Sync</Text>
            <Text style={styles.infoValue}>Agora mesmo</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
    paddingBottom: 24,
  },
  card: {
    backgroundColor: "rgba(255,255,255,0.9)",
    borderRadius: 24,
    padding: 20,
    gap: 16,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
  },
  sunsetCard: {
    backgroundColor: "#ffedd5",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardTitle: {
    color: "#111827",
    fontSize: 18,
    fontWeight: "600",
  },
  iconButton: {
    alignItems: "center",
    backgroundColor: "rgba(249,115,22,0.12)",
    borderRadius: 999,
    padding: 8,
  },
  profileSection: {
    alignItems: "center",
    gap: 4,
  },
  avatarRing: {
    alignItems: "center",
    backgroundColor: "rgba(253,186,116,0.3)",
    borderRadius: 999,
    height: 108,
    justifyContent: "center",
    padding: 8,
    width: 108,
  },
  avatar: {
    borderRadius: 999,
    height: 92,
    width: 92,
  },
  profileName: {
    color: "#111827",
    fontSize: 20,
    fontWeight: "600",
  },
  profileSubtitle: {
    color: "#6b7280",
    fontSize: 14,
  },
  infoList: {
    gap: 12,
  },
  infoRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  infoContent: {
    flex: 1,
    gap: 4,
  },
  infoLabel: {
    color: "#6b7280",
    fontSize: 12,
  },
  infoValue: {
    color: "#111827",
    fontSize: 14,
  },
  mono: {
    fontFamily: "monospace",
  },
  dualRow: {
    flexDirection: "row",
    gap: 16,
  },
  dualColumn: {
    flex: 1,
    gap: 4,
  },
  settingsList: {
    gap: 8,
  },
  settingsRow: {
    alignItems: "center",
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  settingsLeft: {
    alignItems: "center",
    flexDirection: "row",
    gap: 12,
  },
  dualColumnList: {
    gap: 12,
  },
  dualRowItem: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
