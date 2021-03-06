package com.ksa.web.struts2.action.statistics.profit;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.session.SqlSession;

import com.ksa.context.ServiceContextUtils;
import com.ksa.dao.mybatis.session.RowBounds;
import com.ksa.service.bd.CurrencyRateService;
import com.ksa.web.struts2.action.finance.profit.ProfitQueryAction;
import com.ksa.web.struts2.action.statistics.profit.model.FusionChartModel;
import com.opensymphony.xwork2.ModelDriven;


public class ChartQueryAction extends ProfitQueryAction implements ModelDriven<FusionChartModel> {

    private static final long serialVersionUID = 5857518890648552674L;
    
    public static final Map<String, String> modelClassMap;
    public static final Map<String, String> modelNameMap;
    static {
        modelClassMap = new HashMap<String, String>();
        modelClassMap.put( "creator", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByCreator" );
        modelClassMap.put( "customer", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByCustomer" );
        modelClassMap.put( "saler", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupBySaler" );
        modelClassMap.put( "shipper", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByShipper" );
        modelClassMap.put( "consignee", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByConsignee" );
        modelClassMap.put( "departure", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByDeparture" );
        modelClassMap.put( "detination", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByDetination" );
        modelClassMap.put( "type", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByType" );
        modelClassMap.put( "date", "com.ksa.web.struts2.action.statistics.profit.model.FusionChartModelGroupByDate" );
        
        modelNameMap = new HashMap<String, String>();
        modelNameMap.put( "creator", "?????????" );
        modelNameMap.put( "customer", "??????/?????????" );
        modelNameMap.put( "saler", "????????????" );
        modelNameMap.put( "shipper", "?????????" );
        modelNameMap.put( "consignee", "?????????" );
        modelNameMap.put( "departure", "?????????" );
        modelNameMap.put( "detination", "?????????" );
        modelNameMap.put( "type", "????????????" );
        modelNameMap.put( "date", "????????????" );
    }
    
    protected String chart;
    protected String group;
    protected String title;
    protected FusionChartModel model;
    
    @Override
    public String execute() throws Exception {
        if( !modelClassMap.containsKey( group ) ) {
            return ERROR;
        }
        SqlSession sqlSession = ServiceContextUtils.getService( SqlSession.class );
        CurrencyRateService rateService = ServiceContextUtils.getService( CurrencyRateService.class );
        if( sqlSession != null ) {
            Map<String, Object> paras = getParameters();
            List<Object> gridDataList = sqlSession.selectList( getQueryDataStatement(), paras, new RowBounds( this.page, this.rows ) );
            model = (FusionChartModel) Class.forName( modelClassMap.get( group ) ).newInstance();
            model.init( gridDataList, rateService );
            model.setTitle( title );
            model.setLabelX( modelNameMap.get( group ) );
        }
        return SUCCESS;
    }
    
    public String getChart() {
        return chart;
    }
    
    public void setChart( String chart ) {
        this.chart = chart;
    }
    
    public String getGroup() {
        return group;
    }
    
    public void setGroup( String group ) {
        this.group = group;
    }
    
    public String getTitle() {
        return title;
    }
    
    public void setTitle( String title ) {
        this.title = title;
    }

    @Override
    public FusionChartModel getModel() {
        return model;
    }

}
