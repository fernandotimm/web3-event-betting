import ButtonTheme from './ButtonTheme';
import classNames from 'classnames';
import style from './styles.module.scss';

import {ReactComponent as ButtonS} from '../../assets/buttons/button-s.svg';
import {ReactComponent as ButtonM} from '../../assets/buttons/button-m.svg';
import {ReactComponent as ButtonL} from '../../assets/buttons/button-l.svg';
import {ReactComponent as ButtonXL} from '../../assets/buttons/button-xl.svg';

type ButtonProps = {
  children:any,
  className?:string,
  theme:string,
  onClick: React.MouseEventHandler<HTMLSpanElement>,
  disabled?:boolean,
  withoutPadding?:boolean,
  dataTrackingId?:string,
  title?:string,
}

const Button = ({
  children,
  className,
  theme = ButtonTheme.primaryButton,
  onClick,
  disabled = false,
  withoutPadding = false,
  dataTrackingId,
  title,
}:ButtonProps) => {

  const buttonBackground = {
    [ButtonTheme.primaryButtonS]: <ButtonS />,
    [ButtonTheme.primaryButtonM]: <ButtonM />,
    [ButtonTheme.primaryButtonL]: <ButtonL />,
    [ButtonTheme.primaryButtonXL]: <ButtonXL />,
  }

  const renderPrimaryButton = () => {
    return (
      <span
        title={title}
        className={classNames(
          className,
          style.primaryButton,
          style[theme],
          disabled ? style.disabled : null,
        )}
        onClick={disabled ? undefined : onClick}
        data-tracking-id={dataTrackingId}
      >
        {buttonBackground[theme]}
        <span className={style.buttonContent}>{children}</span>
      </span>
    )
  }

  const renderSecondaryButton = () => {
    return (
      <span
        title={title}
        className={classNames(
          className,
          style.secondaryButton,
          style[theme],
          disabled ? style.disabled : null,
        )}
        onClick={disabled ? undefined : onClick}
        data-tracking-id={dataTrackingId}
      >
        <span className={style.buttonContent}>{children}</span>
      </span>
    )
  }

  return (
    <>
      { [
        ButtonTheme.primaryButton,
        ButtonTheme.primaryButtonS,
        ButtonTheme.primaryButtonM,
        ButtonTheme.primaryButtonL,
        ButtonTheme.primaryButtonXL,
      ].includes(theme) ?
        renderPrimaryButton()

        : [
          ButtonTheme.secondaryButton,
          ButtonTheme.secondaryButtonLight
         ] ?
          renderSecondaryButton()

        :
        <span
          title={title}
          className={classNames(
            className,
            style.loginButton,
            disabled ? style.disabled : null,
          )}
          onClick={disabled ? undefined : onClick}
          data-tracking-id={dataTrackingId}
        >
          {children}
        </span>
      }
    </>
  );
};

export default Button;
