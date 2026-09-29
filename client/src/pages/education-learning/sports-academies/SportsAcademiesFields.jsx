import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './sportsAcademiesFields';

export default function SportsAcademiesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
