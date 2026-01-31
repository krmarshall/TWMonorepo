import { ProjectileBombardmentInterface } from '../../../../@types/CharacterInterfaceRef.ts';
import SkillAbilityProjectile from './SkillAbilityProjectile.tsx';

interface PropsInterface {
  bombardment: ProjectileBombardmentInterface;
}

const SkillAbilityBombardment = ({ bombardment }: PropsInterface) => {
  return (
    <div className="w-auto rounded-lg border border-gray-500 mb-2 p-2 shadow-lg">
      <div className="flex flex-row">
        <h5 className="text-left w-24">Drop Delay:</h5>
        <p className="my-auto ml-1">{bombardment.start_time}s</p>
      </div>
      <div className="flex flex-row">
        <h5 className="text-left w-24">Drop Window:</h5>
        <p className="my-auto ml-1">{bombardment.arrival_window}s</p>
      </div>
      <div className="flex flex-row">
        <h5 className="text-left w-24">Spread Radius:</h5>
        <p className="my-auto ml-1">{bombardment.radius_spread}m</p>
      </div>
      {bombardment.num_projectiles !== undefined && bombardment.num_projectiles > 1 && (
        <div className="flex flex-row">
          <h5 className="text-left w-24">Projectile #:</h5>
          <p className="my-auto ml-1">{bombardment.num_projectiles}</p>
        </div>
      )}
      <div className="text-left">
        <h5 className="w-24">Projectile:</h5>
        <div className="w-auto ml-6">
          <SkillAbilityProjectile projectile={bombardment.projectile_type} />
        </div>
      </div>
    </div>
  );
};

export default SkillAbilityBombardment;
