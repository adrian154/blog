## Friday, 2/18

**10.66**

a. The *z* statistic is appropriate because the population standard deviation &sigma; is known.

b. A type I error would be concluding that &mu; = 150 when in fact &mu; > 150. A type II error would be concluding that &mu; > 150 when in fact &mu; = 150.

c. &alpha; = normalcdf(1.8, &infin;) = 0.0359

d. *z* = 1.8, *n* = 50; 1.8 = (x&#772; - &mu;) / (&sigma; / sqrt(n)); x&#772; = 155, &mu; = 153.

<!-- plots -->
<div class="normal-plot">
    <div class="plot" data-mean="153" data-sd="10" data-xbar="155" data-area="0.4207"></div>
    <div class="plot" data-mean="150" data-sd="10" data-xbar="155" data-area="0.3085"></div>
</div>

e. &beta; = normalcdf(155, &infin;, &mu; = 153, &sigma; = 10) = 0.4207

f. &mu; = 160: x&#772; = 162.5456, &beta; = normalcdf(162.5456, &infin;, &mu; = 160, &sigma; = 10) = 0.3995

g. The appropriate conclusion is that the true mean temperature exceeds 150&deg;F. There is the possibility of type I error, where H<sub>0</sub> is rejected when it is actually true.

**10.67**

a. To reject H<sub>0</sub> if *z* &leq; -1.28, &alpha; would be normalcdf(-&infin;, -1.28) = 0.1003.

b. &mu; = 9.8: x&#772; = 9.872, &beta; = 0.2358

c. &beta; will be lower if &mu; = 9.5 since the difference is greater, and thus the odds of failing to reject a true H<sub>0</sub> are smaller.

d. &mu; = 9.8: power = 0.7642, &mu; = 9.5: power = 0.9999

## Tuesday, 2/22

TODO - Wks

## Wednesday, 2/23

**11.3**

a. The two populations are distributed normally, the samples were selected independently, and the samples represent an SRS.

b. Let &mu;<sub>1</sub> be the true mean HRV of dog-owning heart attack patients and &mu;<sub>2</sub> be the true mean HRV of non-dog-owning heart attack patients.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* For non-dog-owning patients, *n* > 30, so the Central Limit Theorem assures us that the sampling distribution will be normal. For dog-owning patients, *n* < 30 but no datapoints are given, so we must assume that the population is normally distributed to proceed with the *t*-test.
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{873-800}{\sqrt{\frac{136^2}{22} + \frac{134^2}{80}}}\\= 2.2367$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="33.0827" data-t="2.2367" data-area="0.0322"></div>

*p* < 0.05, reject H<sub>0</sub>.

**11.5**

Let &mu;<sub>1</sub> be the true mean commute time for male Calgary residents and &mu;<sub>2</sub> be the true mean commute time for female Calgary residents. 

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

&alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* > 30, so the Central Limit Theorem assures us that the sampling distribution will be normal
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{29.6-27.3}{\sqrt{\frac{24.3^2}{247} + \frac{24.0^2}{253}}}\\= 1.0646$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="497.3385" data-t="1.0646" data-area="0.2876"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that there is a difference between the mean commute time for male and female Calgary residents.

**11.8**

Let &mu;<sub>1</sub> be the true mean GPA of employed students and &mu;<sub>2</sub> be the true mean GPA of unemployed students.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; < 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* > 30, so the Central Limit Theorem assures us that the sampling distributions will be normal
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{3.12-3.23}{\sqrt{\frac{0.485^2}{184} + \frac{0.524^2}{114}}}\\= -1.8116$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="225.5522" data-t="-1.8116" data-area="0.0357"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is enough evidence to conclude that the mean GPA of employed students is lower than the mean GPA of unemployed students.

## Thursday, 2/24

**11.10**

Let &mu;<sub>1</sub> be the true mean percentage of time spent with previous partner for genetically altered voles and &mu;<sub>2</sub> be the true mean percentage of time spent with previous partner for unaltered voles.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; > 0

&alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.
* *n* < 30, we need to draw boxplots to assess the normality of the data.

<div class="boxplot" data-min="59" data-q1="67.5" data-median="84.5" data-q3="92" data-max="100"></div>
<div class="boxplot" data-min="2" data-q1="40" data-median="60" data-q3="84" data-max="99"></div>

There doesn't appear to be too much skew, assuming that the populations are normally distributed and proceeding.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{82.6363-56.8}{\sqrt{\frac{13.1017^2}{11} + \frac{29.7491^2}{20}}}\\= 3.3395$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="28.1193" data-t="3.3395" data-area="0.0012"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is enough evidence to conclude that the mean percentage of time spent with their previous partner by genetically altered voles is higher than that of unaltered voles.

**11.13**

Let &mu;<sub>1</sub> be the true mean score of participants in the ginkgo group and &mu;<sub>2</sub> be the true mean score of participants in the placebo group.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; > 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* > 30, so the Central Limit Theorem assures us that the sampling distributions will be normal
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{5.6-5.5}{\sqrt{\frac{0.6^2}{104} + \frac{0.6^2}{115}}}\\= 1.2317$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="214.8066" data-t="1.2317" data-area="0.1097"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that there the mean score of participants in the ginkgo group is greater than the mean score of participants in the placebo group.

## Friday, 2/25

TODO - Wks

## Monday, 2/28

**11.31**

Let &mu; be the true mean difference between exhaustion time after drinking chocolate milk and exhaustion time after drinking a carbohydrate replacement drink.

H<sub>0</sub>: &mu; = 0

H<sub>1</sub>: &mu; > 0

&alpha; = 0.05

*Assumptions* 
* The sample is an SRS.
* *n* is less than 10% of the population.
* *n* < 30, so let's draw a boxplot of the data.

<div class="boxplot" data-min="0.9" data-q1="4.73" data-median="12.71" data-q3="19.095" data-max="27.43"></div>

`$$t = \frac{\bar{x} - H_0}{\frac{s}{\sqrt{n}}} = \frac{14.0789}{\frac{9.4745}{\sqrt{9}}}\\= 4.4576$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="8" data-t="4.4572" data-area="0.0011"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is sufficient evidence to conclude that the true mean of the differences between time to exhaustion with chocolate milk and time to exhaustion with carbohydrate replacement drink is greater than zero.

**11.33**

Let &mu; be the true mean difference between breast feeding bone mineral content and postweaning bone mineral content.

H<sub>0</sub>: &mu; = 25

H<sub>1</sub>: &mu; > 25

&alpha; = 0.05

*Assumptions* 
* The sample is an SRS.
* *n* is less than 10% of the population.
* *n* < 30, so let's draw a boxplot of the data.

<div class="boxplot" data-min="-336" data-q1="-180.5" data-median="-70" data-q3="-34" data-max="-5"></div>

`$$t = \frac{\bar{x} - H_0}{\frac{s}{\sqrt{n}}} = \frac{-105.27 - (-25)}{\frac{103.8450}{\sqrt{10}}}\\= -2.4575$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="9" data-t="-2.4575" data-area="0.0182"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is sufficient evidence to conclude that the true mean difference between breast feeding mineral content and postweaning bone mineral content is greater than 25 g.

**11.36**

Let &mu; be the true mean difference between radiation measurements taken using the two different methods.

H<sub>0</sub>: &mu; = 0

H<sub>1</sub>: &mu; &ne; 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The sample is an SRS.
* *n* is less than 10% of the population.
* *n* < 30, so let's draw a boxplot of the data.

<div class="boxplot" data-min="-6.9" data-q1="-3.2" data-median="0.2" data-q3="2.6" data-max="2.7"></div>

There is some skewness in the data, but no outliers. We will assume that the population is normally distributed and proceed with the *t*-interval.

`$$t = \frac{\bar{x} - H_0}{\frac{s}{\sqrt{n}}} = \frac{-0.7375}{\frac{3.5262}{\sqrt{8}}}\\= -0.5916$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="7" data-t="-0.5916" data-area="0.5727"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that the true mean difference between radiation as measured by the two methods is greater than zero.

## Tuesday, 3/1

**11.45**

Let &pi;<sub>1</sub> be the true proportion of passengers who experienced symptoms after a flight that did not recirculate air, and &pi;<sub>2</sub> be the true proportion of passengers who experienced symptoms after a flight that did recirculate air.

H<sub>0</sub>: &pi;<sub>1</sub> - &pi;<sub>2</sub> = 0

H<sub>1</sub>: &pi;<sub>2</sub> - &pi;<sub>2</sub> &ne; 0

&alpha; = 0.05

*Assumptions* 
* The sample is an SRS.
* *n*&times;&pi; > 10, *n*&times;(1-&pi;) for both samples.
* *n* < 10% of the population

`$$p_c = \frac{n_1p_1 + n_2p_2}{n_1 + n_2} = 0.1991$$`

`$$z = \frac{p_1 - p_2}{\sqrt{\frac{p_c(1-p_c)}{n_1} + \frac{p_c(1-p_c)}{n_2}}} = 0.7676$$`

<div class="normal-plot"><div class="plot" data-mean="0" data-z="0.7676" data-area="0.4431"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that the proportion of passengers who experience symptoms after a flight with recirculated air differs from the proportion of passengers who experienced symptoms after a flight without recirculated air.

**11.47**

Let &pi;<sub>1</sub> be the true proportion of Americans age 12 and over who reported owning an MP3 player in 2005, and &pi;<sub>2</sub> be the true proportion of Americans age 12 and over who reported owning an MP3 player in 2006.

*Assumptions* 
* The sample is an SRS.
* *n*&times;&pi; > 10, *n*&times;(1-&pi;) for both samples.
* *n* < 10% of the population

`$$z_\text{crit} = invNorm(\frac{1 - 0.95}{2}) = 1.96$$`

`$$p_c = \frac{n_1p_1 + n_2p_2}{n_1 + n_2} = 0.175$$`

`$$(p_1 - p_2)\pm z_\text{crit}\sqrt{\frac{p_1(1-p_1)}{n_1} + \frac{p_2(1-p_2)}{n_2}}\\= (-0.0815, -0.0184)$$`

I am 95% confident that the true difference in the proportion of Americans age 12 and over who reported owning an MP3 player in 2005 and 2006 is between 8.15% and 1.84%.

**11.49**

Let &pi;<sub>1</sub> be the true proportion of subjects in the regular chip group who experienced gastrointestinal symptoms, and &pi;<sub>2</sub> be the true proportion of passengers in the Olestra chip group who experienced gastrointestinal symptoms.

H<sub>0</sub>: &pi;<sub>1</sub> - &pi;<sub>2</sub> = 0

H<sub>1</sub>: &pi;<sub>2</sub> - &pi;<sub>2</sub> &ne; 0

&alpha; = 0.05

*Assumptions* 
* The sample is an SRS.
* *n*&times;&pi; > 10, *n*&times;(1-&pi;) for both samples.
* *n*<sub>1</sub> and *n*<sub>2</sub> are both less than 10% of the population

`$$p_c = \frac{n_1p_1 + n_2p_2}{n_1 + n_2} = 0.1676$$`

`$$z = \frac{p_1 - p_2}{\sqrt{\frac{p_c(1-p_c)}{n_1} + \frac{p_c(1-p_c)}{n_2}}} = 0.7051$$`

<div class="normal-plot"><div class="plot" data-mean="0" data-z="0.7051" data-area="0.4808"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that the proportion of subjects in the regular chip group experienced gastrointestinal symptoms at a different rate than subjects in the Olestra chip group.

## Wednesday, 3/2

TODO - Wks

## Thursday, 3/3

**11.61**

a. Let &mu;<sub>1</sub> be the true mean elongation of the square knots and &mu;<sub>2</sub> be the true mean elongation of the Duncan loops for Maxon thread.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* < 30, but it is stated that the population is normally distributed.
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{10-11}{\sqrt{\frac{0.1^2}{10} + \frac{0.3^2}{15}}}\\= -11.9523$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="18.2663" data-t="-11.9523" data-area="0"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is sufficient evidence to conclude that the mean elongation of the Dunan loops is different from the mean elongation of the Duncan loops in Maxon thread.

b. Let &mu;<sub>1</sub> be the true mean elongation of the square knots and &mu;<sub>2</sub> be the true mean elongation of the Duncan loops for Ticron thread.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* < 30, but it is stated that the population is normally distributed.
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{2.5 - 10.9}{\sqrt{\frac{0.06^2}{10} + \frac{0.4^2}{11}}}\\= -68.8029$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="10.4940" data-t="-68.8029" data-area="0"></div>

Reject H<sub>0</sub> at &alpha; = 0.05. There is sufficient evidence to conclude that the mean elongation of the Dunan loops is different from the mean elongation of the Duncan loops in Ticron thread.

c. Let &mu;<sub>1</sub> be the true mean elongation of the Maxon Duncan loops and &mu;<sub>2</sub> be the true mean elongation of the Ticron Duncan loops.

H<sub>0</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> = 0

H<sub>1</sub>: &mu;<sub>1</sub> - &mu;<sub>2</sub> &ne; 0

No &alpha; given, so let &alpha; = 0.05

*Assumptions* 
* The samples are SRSes.
* *n* < 30, but it is stated that the population is normally distributed.
* *n<sub>1</sub>* and *n<sub>2</sub>* are less than 10% of the population.

`$$t = \frac{\bar{x}_1 - \bar{x}_2}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}} = \frac{11.0-10.9}{\sqrt{\frac{0.3^2}{15} + \frac{0.4^2}{11}}}\\= 0.6977$$`

<div class="t-plot"><div class="plot" data-mean="0" data-df="17.7894" data-t="0.6977" data-area="0.4944"></div>

Fail to reject H<sub>0</sub> at &alpha; = 0.05. There is insufficient evidence to conclude that the mean elongation of the Duncan loops in Maxon thread is different from the mean elongation of the Duncan loops in Ticron thread.


**11.65**