import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './hospitalsFields';

export default function HospitalsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
