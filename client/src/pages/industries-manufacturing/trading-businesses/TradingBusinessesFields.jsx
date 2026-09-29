import CategoryBusinessFields from '../../../components/business/CategoryBusinessFields';
import fields from './tradingBusinessesFields';

export default function TradingBusinessesFields(props) {
  return <CategoryBusinessFields {...props} fieldNames={fields} />;
}
