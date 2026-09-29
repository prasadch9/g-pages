import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './hearingSolutionsFields';

export default function HearingSolutionsFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
