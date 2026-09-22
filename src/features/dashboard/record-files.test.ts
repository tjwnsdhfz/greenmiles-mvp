import {describe,it,expect} from "vitest";
import {readRecordFile,writeRecordFile,reviseRecord} from "./record-files";
import {demoDashboardData} from "./data";
const rows=demoDashboardData.rewardEvents;
describe("record review recovery",()=>{
 it("round trips all records while keeping synthetic data labeled",()=>{expect(readRecordFile(writeRecordFile(rows,"DEMO"))).toEqual({records:rows,source:"DEMO"});});
 it("accepts legacy user arrays and preserves user source through backup",()=>{expect(readRecordFile(JSON.stringify(rows)).source).toBe("USER_INPUT");expect(readRecordFile(writeRecordFile(rows,"USER_INPUT")).source).toBe("USER_INPUT");});
 it("rejects unknown versions and invalid records",()=>{expect(()=>readRecordFile('{"format":"greenmiles-review","version":2}')).toThrow();expect(()=>writeRecordFile([{...rows[0],rewardPoints:-1}],"USER_INPUT")).toThrow();});
 it("edits only one copy and invalidates the old MRV claim",()=>{const changed=reviseRecord(rows,{...rows[0],skuName:"수정 상품"});expect(changed[0].mrvStatus).toBe("not_submitted");expect(changed[0].skuName).toBe("수정 상품");expect(rows[0].skuName).not.toBe("수정 상품");expect(changed.slice(1)).toEqual(rows.slice(1));});
 it("rejects unknown identities and oversized input",()=>{expect(()=>reviseRecord(rows,{...rows[0],id:"unknown"})).toThrow();expect(()=>readRecordFile(" ".repeat(1048577))).toThrow("1MB");});
});
