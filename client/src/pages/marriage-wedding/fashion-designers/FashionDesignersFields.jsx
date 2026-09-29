import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './fashionDesignersFields';

export default function FashionDesignersFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
