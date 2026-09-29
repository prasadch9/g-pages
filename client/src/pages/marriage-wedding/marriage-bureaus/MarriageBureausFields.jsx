import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './marriageBureausFields';

export default function MarriageBureausFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
