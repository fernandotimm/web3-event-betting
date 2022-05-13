import styles from './styles.module.scss';
import { chain, useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { simplifyWalletAddress } from '../../utils/commons';
import ButtonTheme from '../Button/ButtonTheme';
import Button from '../Button';

const WalletWidget = () => {

  const { data } = useAccount();
  const { connect } = useConnect({
    connector: new InjectedConnector({
      chains: [chain.ropsten],
    }),
  });
  const { disconnect } = useDisconnect();

  return (
    <div className={styles.walletWidgetContainer}>
      <div className={styles.walletWidget}>
      {data ?
        <Button title="Disconnect" theme={ButtonTheme.secondaryButton} onClick={() => disconnect()}>{simplifyWalletAddress(data.address || '')}</Button>
      :
        <Button theme={ButtonTheme.primaryButtonL} onClick={() => connect()}>Connect</Button>
      }
      </div>
    </div>
  )
}

export default WalletWidget;
