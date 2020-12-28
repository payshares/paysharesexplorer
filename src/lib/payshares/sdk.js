import sdk from 'payshares-sdk'
import URI from 'urijs'

import {LedgerCallBuilder} from 'payshares-sdk/lib/ledger_call_builder'
import {OperationCallBuilder} from 'payshares-sdk/lib/operation_call_builder'
import {TransactionCallBuilder} from 'payshares-sdk/lib/transaction_call_builder'
import {PaymentCallBuilder} from 'payshares-sdk/lib/payment_call_builder'
import {OfferCallBuilder} from 'payshares-sdk/lib/offer_call_builder'
import {EffectCallBuilder} from 'payshares-sdk/lib/effect_call_builder'
import {AccountCallBuilder} from 'payshares-sdk/lib/account_call_builder'
import {AssetsCallBuilder} from 'payshares-sdk/lib/assets_call_builder'
import {TradesCallBuilder} from 'payshares-sdk/lib/trades_call_builder'


/* ----------------------------------------------------------
 *
 * Wraps the payshares-sdk to customise the paging behaviour.
 *
 * ---------------------------------------------------------*/

/**
 * Wrap the Payshares CallBuilder's to modify the default paging behaviour for
 * our needs. Make response.prev and response.next work like typical paging of
 * an ordered result set.
 *
 * @see [Payshares Paging docs](https://www.payshares.org/developers/horizon/reference/resources/page.html)
 */
const wrapPaysharesCallBuilderWithWebPagePaging = CallBuilder => {
  return class WrappedCallBuilder extends CallBuilder {
    wrapNext = rspNext => () => {
      return rspNext().then(rsp => {
        return this.wrap(rsp)
      })
    }

    wrapPrev = rspPrev => () => {
      return rspPrev().then(rsp => {
        // prev requests desc so flip it to the order we maintain for every page
        rsp.records = rsp.records.reverse()

        // prev response sets the next prev to the previous page loaded as opposed to
        // the previous page in the full ordered result set. we want the latter so we
        // slip prev and next here.
        const {prev, next} = rsp
        rsp.next = prev
        rsp.prev = next

        return this.wrap(rsp)
      })
    }

    wrap(paysharesRsp) {
      paysharesRsp.next = this.wrapNext(paysharesRsp.next)
      paysharesRsp.prev = this.wrapPrev(paysharesRsp.prev)
      return paysharesRsp
    }

    /**
   * Calls the parent call() and modifies the response.
   */
    call() {
      return super.call().then(paysharesRsp => {
        return this.wrap(paysharesRsp)
      })
    }
  }
}

/*
 * Wrap the payshares server calls we want to use modified paging on
 */

const pagingCalls = {
  ledgers: LedgerCallBuilder,
  operations: OperationCallBuilder,
  transactions: TransactionCallBuilder,
  payments: PaymentCallBuilder,
  effects: EffectCallBuilder,
  offers: OfferCallBuilder,
  assets: AssetsCallBuilder,
  trades: TradesCallBuilder,
  accounts: AccountCallBuilder,
}

Object.keys(pagingCalls).forEach(
  callName =>
    (sdk.Server.prototype[callName] = function(...params) {
      const WrappedClass = wrapPaysharesCallBuilderWithWebPagePaging(
        pagingCalls[callName]
      )
      return new WrappedClass(URI(this.serverURL), ...params)
    })
)

export default sdk
