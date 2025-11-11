import { User, Dog, Phone, Mail, MapPin, Calendar, Edit, Bell, Shield, ChevronRight } from "lucide-react";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { ImageWithFallback } from "./figma/ImageWithFallback";

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
    <div className="flex flex-col gap-4 pb-6">
      {/* Pet Profile Card */}
      <Card className="p-5 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Perfil do Pet</h3>
          <Button size="sm" variant="ghost" className="text-orange-500">
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <div className="flex flex-col items-center mb-5">
          <div className="w-24 h-24 rounded-full overflow-hidden mb-3 ring-4 ring-orange-100">
            <ImageWithFallback
              src={pet.imageUrl}
              alt={pet.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h2 className="text-gray-900 mb-1">{pet.name}</h2>
          <p className="text-sm text-gray-600">{pet.breed}</p>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <Dog className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Raça</p>
              <p className="text-sm text-gray-900">{pet.breed}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Calendar className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Idade / Data de Nascimento</p>
              <p className="text-sm text-gray-900">{pet.age} anos • {pet.birthDate}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="flex flex-col">
              <p className="text-xs text-gray-600">Peso</p>
              <p className="text-sm text-gray-900">{pet.weight} kg</p>
            </div>
            <div className="flex flex-col">
              <p className="text-xs text-gray-600">Sexo</p>
              <p className="text-sm text-gray-900">{pet.gender}</p>
            </div>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <Shield className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">ID do Microchip</p>
              <p className="text-sm text-gray-900 font-mono">{pet.microchipId}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Owner Profile Card */}
      <Card className="p-5 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Perfil do Dono</h3>
          <Button size="sm" variant="ghost" className="text-orange-500">
            <Edit className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <User className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Nome</p>
              <p className="text-sm text-gray-900">{owner.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Email</p>
              <p className="text-sm text-gray-900">{owner.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Telefone</p>
              <p className="text-sm text-gray-900">{owner.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <MapPin className="w-5 h-5 text-gray-500" />
            <div className="flex-1">
              <p className="text-xs text-gray-600">Endereço</p>
              <p className="text-sm text-gray-900">{owner.address}</p>
            </div>
          </div>
        </div>
      </Card>

      {/* Settings Section */}
      <Card className="p-5 bg-white/80 backdrop-blur-lg border-gray-200">
        <h3 className="text-gray-900 mb-3">Configurações</h3>
        
        <div className="space-y-1">
          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">Notificações</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">Privacidade</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>

          <button className="w-full flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <MapPin className="w-5 h-5 text-gray-600" />
              <span className="text-sm text-gray-900">Zonas Seguras</span>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
          </button>
        </div>
      </Card>

      {/* Collar Info */}
      <Card className="p-5 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-100">
        <h3 className="text-gray-900 mb-3">Informações da Coleira</h3>
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Modelo</span>
            <span className="text-sm text-gray-900">SmartPet Pro X</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Número de Série</span>
            <span className="text-sm text-gray-900 font-mono">SP-2024-7821</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Firmware</span>
            <span className="text-sm text-gray-900">v2.4.1</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-600">Último Sync</span>
            <span className="text-sm text-gray-900">Agora mesmo</span>
          </div>
        </div>
      </Card>
    </div>
  );
}
