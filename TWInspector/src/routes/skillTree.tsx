import { createFileRoute } from '@tanstack/react-router';
import TopBar from '../../../TWPlanner/frontend/src/components/Planner/TopBar';
import StatsDrawer from '../../../TWPlanner/frontend/src/components/Planner/StatsDrawer/StatsDrawer';
import SkillTable from '../../../TWPlanner/frontend/src/components/Planner/SkillTable';
import ExtrasDrawer from '../../../TWPlanner/frontend/src/components/Planner/ExtrasDrawer/ExtrasDrawer';

export const Route = createFileRoute('/skillTree')({
  component: SkillTree,
});

function SkillTree() {
  return (
    <div className="grow mt-1 flex flex-col bg-gray-700 w-full border border-gray-500 rounded-md px-2 py-2 overflow-y-hidden overflow-x-hidden">
      {/* <TopBar isMobile={false} /> */}
      <div className="relative flex flex-row flex-nowrap grow max-h-[88vh] min-h-[50vh]">
        {/* <StatsDrawer /> */}

        <SkillTable faction={'other'} />
      </div>
      {/* <ExtrasDrawer /> */}
    </div>
  );
}
