import IconFont from '@_components/IconFont';
import { Button, message } from 'antd';
import CodeViewer from './CodeViewer';
import { handelCopy } from '@_utils/copy';
import Download from '@_components/Download';
import copy from 'copy-to-clipboard';
import { useState } from 'react';

export default function SourceCode() {
  const files = [
    {
      name: 'AllCalculateFeeCoefficients.cs',
      fileType: 'txt',
      content:
        'dXNpbmcgRUJyaWRnZS5Db250cmFjdHMuU3RyaW5nQWdncmVnYXRvcjsNCnVzaW5nIEdvb2dsZS5Qcm90b2J1ZjsNCnVzaW5nIEdvb2dsZS5Qcm90b2J1Zi5Db2xsZWN0aW9uczsNCnVzaW5nIEdvb2dsZS5Qcm90b2J1Zi5SZWZsZWN0aW9uOw0KdXNpbmcgU3lzdGVtOw0KdXNpbmcgU3lzdGVtLkRpYWdub3N0aWNzOw0KDQpuYW1lc3BhY2UgQUVsZi5Db250cmFjdHMuTXVsdGlUb2tlbg0Kew0KCWludGVybmFsIHNlYWxlZCBjbGFzcyBBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMgOiBJTWVzc2FnZTxBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHM+LCBJTWVzc2FnZSwgSUVxdWF0YWJsZTxBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHM+LCBJRGVlcENsb25lYWJsZTxBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHM+DQoJew0KCQlwcml2YXRlIHN0YXRpYyByZWFkb25seSBNZXNzYWdlUGFyc2VyPEFsbENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cz4gX3BhcnNlcjsNCg0KCQlwcml2YXRlIFVua25vd25GaWVsZFNldCBfdW5rbm93bkZpZWxkczsNCg0KCQlwdWJsaWMgY29uc3QgaW50IFZhbHVlRmllbGROdW1iZXIgPSAxOw0KDQoJCXByaXZhdGUgc3RhdGljIHJlYWRvbmx5IEZpZWxkQ29kZWM8Q2FsY3VsYXRlRmVlQ29lZmZpY2llbnRzPiBfcmVwZWF0ZWRfdmFsdWVfY29kZWM7DQoNCgkJcHJpdmF0ZSByZWFkb25seSBSZXBlYXRlZEZpZWxkPENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cz4gdmFsdWVfOw0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgc3RhdGljIE1lc3NhZ2VQYXJzZXI8QWxsQ2FsY3VsYXRlRmVlQ29lZmZpY2llbnRzPiBQYXJzZXINCgkJew0KCQkJZ2V0DQoJCQl7DQoJCQkJRXhlY3V0aW9uT2JzZXJ2ZXJQcm94eS5DYWxsQ291bnQoKTsNCgkJCQlyZXR1cm4gX3BhcnNlcjsNCgkJCX0NCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgc3RhdGljIE1lc3NhZ2VEZXNjcmlwdG9yIERlc2NyaXB0b3INCgkJew0KCQkJZ2V0DQoJCQl7DQoJCQkJRXhlY3V0aW9uT2JzZXJ2ZXJQcm94eS5DYWxsQ291bnQoKTsNCgkJCQlyZXR1cm4gVG9rZW5Db250cmFjdFJlZmxlY3Rpb24uRGVzY3JpcHRvci5NZXNzYWdlVHlwZXNbMzhdOw0KCQkJfQ0KCQl9DQoNCgkJW0RlYnVnZ2VyTm9uVXNlckNvZGVdDQoJCU1lc3NhZ2VEZXNjcmlwdG9yIElNZXNzYWdlLkRlc2NyaXB0b3INCgkJew0KCQkJZ2V0DQoJCQl7DQoJCQkJRXhlY3V0aW9uT2JzZXJ2ZXJQcm94eS5DYWxsQ291bnQoKTsNCgkJCQlyZXR1cm4gRGVzY3JpcHRvcjsNCgkJCX0NCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgUmVwZWF0ZWRGaWVsZDxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHM+IFZhbHVlDQoJCXsNCgkJCWdldA0KCQkJew0KCQkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQkJcmV0dXJuIHZhbHVlXzsNCgkJCX0NCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgQWxsQ2FsY3VsYXRlRmVlQ29lZmZpY2llbnRzKCkNCgkJew0KCQkJRXhlY3V0aW9uT2JzZXJ2ZXJQcm94eS5DYWxsQ291bnQoKTsNCgkJCXZhbHVlXyA9IG5ldyBSZXBlYXRlZEZpZWxkPENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cz4oKTsNCgkJCWJhc2UuXzAwMkVjdG9yKCk7DQoJCX0NCg0KCQlbRGVidWdnZXJOb25Vc2VyQ29kZV0NCgkJcHVibGljIEFsbENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cyhBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMgb3RoZXIpDQoJCXsNCgkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQl0aGlzLl8wMDJFY3RvcigpOw0KCQkJdmFsdWVfID0gb3RoZXIudmFsdWVfLkNsb25lKCk7DQoJCQlfdW5rbm93bkZpZWxkcyA9IFVua25vd25GaWVsZFNldC5DbG9uZShvdGhlci5fdW5rbm93bkZpZWxkcyk7DQoJCX0NCg0KCQlbRGVidWdnZXJOb25Vc2VyQ29kZV0NCgkJcHVibGljIEFsbENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cyBDbG9uZSgpDQoJCXsNCgkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQlyZXR1cm4gbmV3IEFsbENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cyh0aGlzKTsNCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgb3ZlcnJpZGUgYm9vbCBFcXVhbHMob2JqZWN0IG90aGVyKQ0KCQl7DQoJCQlFeGVjdXRpb25PYnNlcnZlclByb3h5LkNhbGxDb3VudCgpOw0KCQkJcmV0dXJuIEVxdWFscyhvdGhlciBhcyBBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMpOw0KCQl9DQoNCgkJW0RlYnVnZ2VyTm9uVXNlckNvZGVdDQoJCXB1YmxpYyBib29sIEVxdWFscyhBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMgb3RoZXIpDQoJCXsNCgkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQlpZiAob3RoZXIgPT0gbnVsbCkNCgkJCXsNCgkJCQlyZXR1cm4gZmFsc2U7DQoJCQl9DQoJCQlpZiAob3RoZXIgPT0gdGhpcykNCgkJCXsNCgkJCQlyZXR1cm4gdHJ1ZTsNCgkJCX0NCgkJCWlmICghdmFsdWVfLkVxdWFscyhvdGhlci52YWx1ZV8pKQ0KCQkJew0KCQkJCXJldHVybiBmYWxzZTsNCgkJCX0NCgkJCXJldHVybiBvYmplY3QuRXF1YWxzKF91bmtub3duRmllbGRzLCBvdGhlci5fdW5rbm93bkZpZWxkcyk7DQoJCX0NCg0KCQlbRGVidWdnZXJOb25Vc2VyQ29kZV0NCgkJcHVibGljIG92ZXJyaWRlIGludCBHZXRIYXNoQ29kZSgpDQoJCXsNCgkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQlpbnQgbnVtID0gMTsNCgkJCW51bSBePSB2YWx1ZV8uR2V0SGFzaENvZGUoKTsNCgkJCWlmIChfdW5rbm93bkZpZWxkcyAhPSBudWxsKQ0KCQkJew0KCQkJCW51bSBePSBfdW5rbm93bkZpZWxkcy5HZXRIYXNoQ29kZSgpOw0KCQkJfQ0KCQkJcmV0dXJuIG51bTsNCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgb3ZlcnJpZGUgc3RyaW5nIFRvU3RyaW5nKCkNCgkJew0KCQkJRXhlY3V0aW9uT2JzZXJ2ZXJQcm94eS5DYWxsQ291bnQoKTsNCgkJCXJldHVybiBKc29uRm9ybWF0dGVyLlRvRGlhZ25vc3RpY1N0cmluZyh0aGlzKTsNCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgdm9pZCBXcml0ZVRvKENvZGVkT3V0cHV0U3RyZWFtIG91dHB1dCkNCgkJew0KCQkJRXhlY3V0aW9uT2JzZXJ2ZXJQcm94eS5DYWxsQ291bnQoKTsNCgkJCXZhbHVlXy5Xcml0ZVRvKG91dHB1dCwgX3JlcGVhdGVkX3ZhbHVlX2NvZGVjKTsNCgkJCWlmIChfdW5rbm93bkZpZWxkcyAhPSBudWxsKQ0KCQkJew0KCQkJCV91bmtub3duRmllbGRzLldyaXRlVG8ob3V0cHV0KTsNCgkJCX0NCgkJfQ0KDQoJCVtEZWJ1Z2dlck5vblVzZXJDb2RlXQ0KCQlwdWJsaWMgaW50IENhbGN1bGF0ZVNpemUoKQ0KCQl7DQoJCQlFeGVjdXRpb25PYnNlcnZlclByb3h5LkNhbGxDb3VudCgpOw0KCQkJaW50IG51bSA9IDA7DQoJCQljaGVja2VkDQoJCQl7DQoJCQkJbnVtICs9IHZhbHVlXy5DYWxjdWxhdGVTaXplKF9yZXBlYXRlZF92YWx1ZV9jb2RlYyk7DQoJCQkJaWYgKF91bmtub3duRmllbGRzICE9IG51bGwpDQoJCQkJew0KCQkJCQludW0gKz0gX3Vua25vd25GaWVsZHMuQ2FsY3VsYXRlU2l6ZSgpOw0KCQkJCX0NCgkJCQlyZXR1cm4gbnVtOw0KCQkJfQ0KCQl9DQoNCgkJW0RlYnVnZ2VyTm9uVXNlckNvZGVdDQoJCXB1YmxpYyB2b2lkIE1lcmdlRnJvbShBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMgb3RoZXIpDQoJCXsNCgkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQlpZiAob3RoZXIgIT0gbnVsbCkNCgkJCXsNCgkJCQl2YWx1ZV8uQWRkKG90aGVyLnZhbHVlXyk7DQoJCQkJX3Vua25vd25GaWVsZHMgPSBVbmtub3duRmllbGRTZXQuTWVyZ2VGcm9tKF91bmtub3duRmllbGRzLCBvdGhlci5fdW5rbm93bkZpZWxkcyk7DQoJCQl9DQoJCX0NCg0KCQlbRGVidWdnZXJOb25Vc2VyQ29kZV0NCgkJcHVibGljIHZvaWQgTWVyZ2VGcm9tKENvZGVkSW5wdXRTdHJlYW0gaW5wdXQpDQoJCXsNCgkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQl1aW50IG51bTsNCgkJCXdoaWxlICgobnVtID0gaW5wdXQuUmVhZFRhZygpKSAhPSAwKQ0KCQkJew0KCQkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQnJhbmNoQ291bnQoKTsNCgkJCQlpZiAobnVtICE9IDEwKQ0KCQkJCXsNCgkJCQkJX3Vua25vd25GaWVsZHMgPSBVbmtub3duRmllbGRTZXQuTWVyZ2VGaWVsZEZyb20oX3Vua25vd25GaWVsZHMsIGlucHV0KTsNCgkJCQl9DQoJCQkJZWxzZQ0KCQkJCXsNCgkJCQkJdmFsdWVfLkFkZEVudHJpZXNGcm9tKGlucHV0LCBfcmVwZWF0ZWRfdmFsdWVfY29kZWMpOw0KCQkJCX0NCgkJCX0NCgkJfQ0KDQoJCXN0YXRpYyBBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMoKQ0KCQl7DQoJCQlFeGVjdXRpb25PYnNlcnZlclByb3h5LkNhbGxDb3VudCgpOw0KCQkJX3BhcnNlciA9IG5ldyBNZXNzYWdlUGFyc2VyPEFsbENhbGN1bGF0ZUZlZUNvZWZmaWNpZW50cz4oKEZ1bmM8QWxsQ2FsY3VsYXRlRmVlQ29lZmZpY2llbnRzPilkZWxlZ2F0ZQ0KCQkJew0KCQkJCUV4ZWN1dGlvbk9ic2VydmVyUHJveHkuQ2FsbENvdW50KCk7DQoJCQkJcmV0dXJuIG5ldyBBbGxDYWxjdWxhdGVGZWVDb2VmZmljaWVudHMoKTsNCgkJCX0pOw0KCQkJX3JlcGVhdGVkX3ZhbHVlX2NvZGVjID0gRmllbGRDb2RlYy5Gb3JNZXNzYWdlKDEwdSwgQ2FsY3VsYXRlRmVlQ29lZmZpY2llbnRzLlBhcnNlcik7DQoJCX0NCgl9DQp9DQo=',
    },
  ];
  const [linkStatus, setLinkStatus] = useState(false);
  const copyCode = () => {
    handelCopy(window.atob(files[0].content));
  };
  const copyLink = () => {
    try {
      copy(window.location.href);
      setLinkStatus(true);
      setTimeout(() => {
        setLinkStatus(false);
      }, 1000);
    } catch (e) {
      message.error('Copy failed, please copy by yourself.');
    }
  };

  const [codeAuto, setCodeAuto] = useState(false);
  const viewChange = () => {
    setCodeAuto(!codeAuto);
  };
  return (
    <div className="contract-source-code px-4">
      <div className="source-header flex items-center justify-between py-4">
        <div>
          <IconFont className="text-xs mr-1" type="contract-aa3pc9ha" />
          <span className="inline-block text-sm leading-[22px] text-base-100">Contract Source Code</span>
        </div>
        <div className="view flex items-center">
          <Download files={files} fileName={'contract'} />
          <Button
            className="view-button mx-2"
            icon={<IconFont className="!text-xs" type="view-copy" />}
            onClick={copyCode}
          />
          <Button
            className="view-button mr-2"
            icon={<IconFont className="!text-xs" type={linkStatus ? 'link-success' : 'link'} />}
            onClick={copyLink}
          />
          <Button
            className="view-button"
            icon={<IconFont className="!text-xs" type={!codeAuto ? 'viewer' : 'viewer-full'} />}
            onClick={viewChange}
          />
        </div>
      </div>
      <div className="code-container">
        <CodeViewer auto={codeAuto} data={window.atob(files[0].content)} name={files[0].name} />
      </div>
    </div>
  );
}
