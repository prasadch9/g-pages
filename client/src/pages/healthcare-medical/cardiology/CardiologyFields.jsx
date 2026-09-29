import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './cardiologyFields';

export default function CardiologyFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
