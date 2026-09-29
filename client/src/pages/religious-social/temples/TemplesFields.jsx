import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './templesFields';

export default function TemplesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
