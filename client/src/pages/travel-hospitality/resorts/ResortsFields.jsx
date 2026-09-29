import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './resortsFields';

export default function ResortsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
