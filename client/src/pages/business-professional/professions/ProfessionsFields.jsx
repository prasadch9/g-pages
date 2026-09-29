import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './professionsFields';

export default function ProfessionsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
