import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './consultanciesFields';

export default function ConsultanciesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
