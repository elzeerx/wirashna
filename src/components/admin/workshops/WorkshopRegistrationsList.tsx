
import { WorkshopRegistrationsList } from "../workshops/registrations";

interface WorkshopRegistrationsListProps {
  workshopId: string;
}

const WorkshopRegistrationsListWrapper = ({ workshopId }: WorkshopRegistrationsListProps) => {
  return <WorkshopRegistrationsList workshopId={workshopId} />;
};

export default WorkshopRegistrationsListWrapper;
