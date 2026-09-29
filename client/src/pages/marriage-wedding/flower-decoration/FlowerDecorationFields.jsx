import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './flowerDecorationFields';

export default function FlowerDecorationFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
