import IconFont from '@_components/IconFont';
import { Input } from 'aelf-design';
import './index.css';

export default function EPSearch({ placeholder = 'Search Token Name  Token Symbol', ...params }) {
  return (
    <div className="ep-search">
      <Input
        prefix={<IconFont className="text-xs text-base-200" type="search" />}
        placeholder={placeholder}
        {...params}
      />
    </div>
  );
}
