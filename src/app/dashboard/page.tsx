import DashboardWorkspace from '@/components/dashboard-workspace';
import {StudioAuthBoundary} from '@/components/studio-auth-boundary';
export default function Page(){return <StudioAuthBoundary><DashboardWorkspace/></StudioAuthBoundary>}
