import styles from './styles.module.scss';
import { chain, useAccount, useConnect, useDisconnect } from 'wagmi';
import { InjectedConnector } from 'wagmi/connectors/injected';
import { simplifyWalletAddress } from '../../utils/commons';

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
          <>
            Connected to {simplifyWalletAddress(data.address || '')}
            <button onClick={() => disconnect()}>Disconnect</button>
          </>
      :
          <button onClick={() => connect()}>Connect Wallet</button>
      }
      </div>
    </div>
  )
}

export default WalletWidget;
