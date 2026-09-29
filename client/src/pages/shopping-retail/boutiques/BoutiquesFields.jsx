import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './boutiquesFields';

export default function BoutiquesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
