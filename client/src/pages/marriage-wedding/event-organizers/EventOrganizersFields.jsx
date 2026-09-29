import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './eventOrganizersFields';

export default function EventOrganizersFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
