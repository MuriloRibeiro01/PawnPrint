import React from "react";
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
  Settings,
} from "lucide-react-native";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Alert,
} from "react-native";

// Imports da Arquitetura Limpa
import { ImageWithFallback } from "../components/ui/ImageWithFallback"; 
import { useUserStore } from "../store/userStore"; // <--- Conecta na Store do usuário

export function ProfileScreen() {
  // 1. BUSCA DADOS DA STORE (Sem props!)
  const pet = useUserStore((state) => state.pet);
  const owner = useUserStore((state) => state.owner);

  // Função placeholder para botões de editar
  const handleEdit = (section: string) => {
    Alert.alert("Editar", `Funcionalidade de editar ${section} em breve!`);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      
      {/* CARD DO PET */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Perfil do Pet</Text>
          <Pressable style={styles.iconButton} onPress={() => handleEdit("Pet")}>
            <Edit color="#f97316" size={18} />
          </Pressable>
        </View>

        <View style={styles.profileSection}>
          <View style={styles.avatarRing}>
            <ImageWithFallback
              uri={pet.imageUrl}
              style={styles.avatar}
              fallbackLabel={pet.name}
            />
          </View>
          <Text style={styles.profileName}>{pet.name}</Text>
          <Text style={styles.profileSubtitle}>{pet.breed}</Text>
        </View>

        <View style={styles.infoList}>
          <InfoRow icon={Dog} label="Raça" value={pet.breed} />
          <InfoRow icon={Calendar} label="Idade / Nascimento" value={`${pet.age} anos • ${pet.birthDate}`} />
          
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

          <InfoRow icon={Shield} label="Microchip ID" value={pet.microchipId} mono />
        </View>
      </View>

      {/* CARD DO DONO */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <Text style={styles.cardTitle}>Perfil do Dono</Text>
          <Pressable style={styles.iconButton} onPress={() => handleEdit("Dono")}>
            <Edit color="#f97316" size={18} />
          </Pressable>
        </View>

        <View style={styles.infoList}>
          <InfoRow icon={User} label="Nome" value={owner.name} />
          <InfoRow icon={Mail} label="Email" value={owner.email} />
          <InfoRow icon={Phone} label="Telefone" value={owner.phone} />
          <InfoRow icon={MapPin} label="Endereço" value={owner.address} />
        </View>
      </View>

      {/* CONFIGURAÇÕES */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>Configurações</Text>
        <View style={styles.settingsList}>
          <SettingsRow icon={Bell} label="Notificações" />
          <SettingsRow icon={Shield} label="Privacidade" />
          <SettingsRow icon={MapPin} label="Zonas Seguras" />
        </View>
      </View>

      {/* INFO DA COLEIRA */}
      <View style={[styles.card, styles.sunsetCard]}>
        <Text style={styles.cardTitle}>Informações da Coleira</Text>
        <View style={styles.dualColumnList}>
          <DualRow label="Modelo" value="SmartPet Pro X" />
          <DualRow label="S/N" value="SP-2024-7821" mono />
          <DualRow label="Firmware" value="v2.4.1" />
          <DualRow label="Último Sync" value="Agora mesmo" />
        </View>
      </View>
      
    </ScrollView>
  );
}

// COMPONENTES AUXILIARES (Para limpar o código principal)
// Isso evita aquele monte de <View><Icon/><Text>...</View> repetido

function InfoRow({ icon: Icon, label, value, mono }: any) {
  return (
    <View style={styles.infoRow}>
      <Icon color="#6b7280" size={18} />
      <View style={styles.infoContent}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={[styles.infoValue, mono && styles.mono]}>{value}</Text>
      </View>
    </View>
  );
}

function SettingsRow({ icon: Icon, label }: any) {
  return (
    <Pressable style={styles.settingsRow}>
      <View style={styles.settingsLeft}>
        <Icon color="#6b7280" size={18} />
        <Text style={styles.infoValue}>{label}</Text>
      </View>
      <ChevronRight color="#9ca3af" size={18} />
    </Pressable>
  );
}

function DualRow({ label, value, mono }: any) {
  return (
    <View style={styles.dualRowItem}>
      <Text style={styles.infoLabel}>{label}</Text>
      <Text style={[styles.infoValue, mono && styles.mono]}>{value}</Text>
    </View>
  );
}

// MANTENHA O STYLESHEET IGUAL (Só copiei a estrutura pra garantir)
const styles = StyleSheet.create({
  container: { gap: 16, padding: 16, paddingBottom: 100 },
  card: { backgroundColor: "rgba(255,255,255,0.9)", borderRadius: 24, padding: 20, gap: 16 },
  sunsetCard: { backgroundColor: "#ffedd5" },
  cardHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { color: "#111827", fontSize: 18, fontWeight: "600" },
  iconButton: { backgroundColor: "rgba(249,115,22,0.12)", borderRadius: 999, padding: 8 },
  profileSection: { alignItems: "center", gap: 4 },
  avatarRing: { alignItems: "center", backgroundColor: "rgba(253,186,116,0.3)", borderRadius: 999, padding: 8 },
  avatar: { borderRadius: 999, height: 92, width: 92 },
  profileName: { color: "#111827", fontSize: 20, fontWeight: "600" },
  profileSubtitle: { color: "#6b7280", fontSize: 14 },
  infoList: { gap: 12 },
  infoRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  infoContent: { flex: 1, gap: 4 },
  infoLabel: { color: "#6b7280", fontSize: 12 },
  infoValue: { color: "#111827", fontSize: 14 },
  mono: { fontFamily: "monospace" }, // Se não tiver fonte monospace no Android, vai usar a padrão.
  dualRow: { flexDirection: "row", gap: 16 },
  dualColumn: { flex: 1, gap: 4 },
  settingsList: { gap: 8 },
  settingsRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, paddingHorizontal: 16, backgroundColor: '#f8fafc', borderRadius: 16 },
  settingsLeft: { flexDirection: "row", alignItems: "center", gap: 12 },
  dualColumnList: { gap: 12 },
  dualRowItem: { flexDirection: "row", justifyContent: "space-between" },
});