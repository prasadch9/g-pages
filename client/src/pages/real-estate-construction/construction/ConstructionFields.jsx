import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './constructionFields';

export default function ConstructionFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
