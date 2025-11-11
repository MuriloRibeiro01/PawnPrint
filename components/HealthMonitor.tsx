import { Heart, Activity, TrendingUp, Droplets } from "lucide-react";
import { Card } from "./ui/card";
import { Progress } from "./ui/progress";

interface HealthMonitorProps {
  petName: string;
  health: {
    heartRate: number;
    temperature: number;
    activityLevel: number;
    stepsToday: number;
    waterIntake: number;
    sleepHours: number;
  };
}

export function HealthMonitor({ petName, health }: HealthMonitorProps) {
  const stepsGoal = 8000;
  const waterGoal = 500;
  const sleepGoal = 12;

  return (
    <div className="flex flex-col gap-4 pb-6">
      {/* Heart Rate Card */}
      <Card className="p-5 bg-gradient-to-br from-red-50 to-pink-50 border-red-100">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-red-500" />
            <h3 className="text-gray-900">Frequência Cardíaca</h3>
          </div>
          <span className="text-xs text-gray-600">Normal</span>
        </div>
        <p className="text-gray-900 mb-1">{health.heartRate} BPM</p>
        <p className="text-sm text-gray-600">Faixa saudável: 60-140 BPM</p>
        
        {/* Simulated heart rate graph */}
        <div className="mt-4 h-20 flex items-end gap-1">
          {[65, 70, 68, 72, 75, 73, 78, 76, 72, 70, 68, 65, 70, 75, 72].map((value, index) => (
            <div
              key={index}
              className="flex-1 bg-red-400 rounded-t"
              style={{ height: `${(value / 80) * 100}%` }}
            />
          ))}
        </div>
      </Card>

      {/* Temperature Card */}
      <Card className="p-5 bg-gradient-to-br from-orange-50 to-amber-50 border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Temperatura Corporal</h3>
          <span className="text-xs text-green-600">● Saudável</span>
        </div>
        <div className="flex items-baseline gap-2">
          <p className="text-gray-900">{health.temperature}°C</p>
          <span className="text-sm text-gray-600">(Normal: 38-39°C)</span>
        </div>
      </Card>

      {/* Activity & Steps */}
      <Card className="p-5 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <Activity className="w-6 h-6 text-orange-500" />
          <h3 className="text-gray-900">Atividade Física</h3>
        </div>
        
        <div className="space-y-4">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Passos Hoje</span>
              <span className="text-sm text-gray-900">
                {health.stepsToday.toLocaleString()} / {stepsGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={(health.stepsToday / stepsGoal) * 100} className="h-2" />
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm text-gray-700">Nível de Atividade</span>
              <span className="text-sm text-gray-900">{health.activityLevel}%</span>
            </div>
            <Progress value={health.activityLevel} className="h-2" />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 mt-4 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Caminhada</p>
            <p className="text-sm text-gray-900">2.5 km</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Corrida</p>
            <p className="text-sm text-gray-900">800 m</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-600 mb-1">Calorias</p>
            <p className="text-sm text-gray-900">420 kcal</p>
          </div>
        </div>
      </Card>

      {/* Hydration */}
      <Card className="p-5 bg-gradient-to-br from-yellow-50 to-amber-50 border-yellow-100">
        <div className="flex items-center gap-2 mb-4">
          <Droplets className="w-6 h-6 text-yellow-600" />
          <h3 className="text-gray-900">Hidratação</h3>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700">Água consumida hoje</span>
          <span className="text-sm text-gray-900">{health.waterIntake}ml / {waterGoal}ml</span>
        </div>
        <Progress value={(health.waterIntake / waterGoal) * 100} className="h-2" />
      </Card>

      {/* Sleep */}
      <Card className="p-5 bg-gradient-to-br from-orange-50 to-red-50 border-orange-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-900">Descanso</h3>
          <span className="text-xs text-gray-600">Última noite</span>
        </div>
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-700">Horas dormidas</span>
          <span className="text-sm text-gray-900">{health.sleepHours}h / {sleepGoal}h</span>
        </div>
        <Progress value={(health.sleepHours / sleepGoal) * 100} className="h-2" />
        <p className="text-sm text-gray-600 mt-3">Qualidade do sono: Excelente</p>
      </Card>

      {/* Weekly Summary */}
      <Card className="p-5 bg-white/80 backdrop-blur-lg border-gray-200">
        <div className="flex items-center gap-2 mb-4">
          <TrendingUp className="w-5 h-5 text-orange-500" />
          <h3 className="text-gray-900">Resumo Semanal</h3>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-600 mb-1">Total de Passos</p>
            <p className="text-gray-900">52,340</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Atividade Média</p>
            <p className="text-gray-900">68%</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Distância Total</p>
            <p className="text-gray-900">18.5 km</p>
          </div>
          <div>
            <p className="text-xs text-gray-600 mb-1">Calorias Queimadas</p>
            <p className="text-gray-900">2,940 kcal</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
